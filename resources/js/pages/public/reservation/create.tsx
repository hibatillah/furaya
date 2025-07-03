import { DataList } from "@/components/data-list";
import { ImageContainer } from "@/components/image";
import { InputDate } from "@/components/input-date";
import InputError from "@/components/input-error";
import { SubmitButton } from "@/components/submit-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import GuestLayout from "@/layouts/guest-layout";
import { cn, formatCurrency } from "@/lib/utils";
import { dateConfig } from "@/static";
import { MIN_ADVANCE_AMOUNT } from "@/static/reservation";
import { MidtransResult } from "@/types";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { addYears, format } from "date-fns";
import { AlertCircleIcon, BedIcon, CircleSlashIcon, InfoIcon, Maximize2Icon, UsersRoundIcon, WalletIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import PublicLogin from "../auth/login";

interface PublicReservationCreateProps {
  roomType: RoomType.Default;
  genders: Enum.Gender[];
  nationalities: Nationality.Default[];
  smokingTypes: Enum.SmokingType[];
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  promoCode: string;
  lengthOfStay: number;
  user: User.Default;
}

export default function PublicReservationsCreate(props: PublicReservationCreateProps) {
  const { roomType, genders, nationalities, smokingTypes, startDate, endDate, adults, children, lengthOfStay, user } = props;

  const [loginDialog, setLoginDialog] = useState(false);

  // declare initial data
  const pax = adults + children;
  const BASE_BREAKFAST_RATE = 70_000;
  const formatStartDate = format(new Date(startDate), "dd MMMM yyyy", dateConfig);
  const formatEndDate = format(new Date(endDate), "dd MMMM yyyy", dateConfig);

  const [selectedPayment, setSelectedPayment] = useState<string>("later");
  const [smokingTypeSelected, setSmokingTypeSelected] = useState<Enum.SmokingType>("non smoking");
  const [includeBreakfast, setIncludeBreakfast] = useState(true);
  const [selectedNationality, setSelectedNationality] = useState<string>("");

  // declare form
  const initialBirthdateYear = addYears(new Date(), -17); // Customer must be at least 17 years old

  // calculate accumulated breakfast rate
  const accumulatedBreakfastRate = useMemo(() => {
    return BASE_BREAKFAST_RATE * lengthOfStay;
  }, [lengthOfStay]);

  // calculate total price
  const totalPrice = useMemo(() => {
    let totalPrice = Number(roomType.base_rate);

    totalPrice += includeBreakfast ? accumulatedBreakfastRate : 0;
    totalPrice *= lengthOfStay;

    return totalPrice;
  }, [accumulatedBreakfastRate, includeBreakfast, lengthOfStay, roomType.base_rate]);

  // declare form
  const { data, setData, post, processing, errors } = useForm<Reservation.Create>({
    // reservation data
    start_date: format(new Date(startDate), "yyyy-MM-dd"),
    end_date: format(new Date(endDate), "yyyy-MM-dd"),
    length_of_stay: lengthOfStay,
    adults: adults,
    status: "pending" as Enum.ReservationStatus,
    pax,
    total_price: totalPrice,
    children: children,
    arrival_from: "",
    guest_type: "",
    booking_type: "online" as Enum.BookingType,
    visit_purpose: "other" as Enum.VisitPurpose,
    room_package: "other" as Enum.RoomPackage,
    payment_method: "other" as Enum.Payment,
    status_acc: "pending" as Enum.StatusAcc,
    discount: "",
    discount_reason: "",
    commission_percentage: "",
    commission_amount: "",
    remarks: "",
    advance_remarks: "",
    advance_amount: MIN_ADVANCE_AMOUNT,
    smoking_type: smokingTypeSelected,
    include_breakfast: includeBreakfast,

    // guest data
    name: user?.name ?? "",
    email: user?.email ?? "",
    nik_passport: user?.guest?.nik_passport ?? "",
    phone: user?.guest?.phone ?? "",
    gender: user?.guest?.gender ?? ("" as Enum.Gender),
    birthdate: "",
    profession: user?.guest?.profession ?? "",
    nationality: user?.guest?.nationality ?? "",
    address: user?.guest?.address ?? "",
    country: user?.guest?.country ?? "",

    // room data
    room_id: "",
    room_number: "",
    room_type_id: roomType.id,
    room_type_name: roomType.name,
    room_rate: "",
    bed_type: "",
    view: "",
  });

  /**
   * Handle create reservation
   *
   * - Create new reservation
   * - Show payment snap window
   * - Update reservation payment data
   */
  function handleCreateReservation(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      toast.error("Login terlebih dahulu", {
        description: "Silakan login terlebih dahulu untuk membuat reservasi kamar",
      });
      return;
    }

    // sent data
    toast.loading("Menambahkan reservasi...", { id: "create-reservation" });

    post(route("public.reservation.store"), {
      onSuccess: async (page: Record<string, any>) => {
        const reservationId = page.props.flash?.data?.reservation_id;

        if (!reservationId) {
          toast.error("Gagal mendapatkan ID reservasi", {
            id: "create-reservation",
          });
          return;
        }

        toast.success("Reservasi berhasil ditambahkan", {
          id: "create-reservation",
        });

        // return if use later payment
        if (selectedPayment === "later") {
          router.visit(route("public.reservation.history"));
          return;
        }

        // show payment snap window
        try {
          toast.info("Memproses pembayaran", { id: "process-payment" });

          // get snap token using reservation id
          const snapToken = await getSnapToken(reservationId);

          if (!snapToken) {
            throw new Error("Snap token kosong");
          }

          // show payment snap window
          processPayment(snapToken, reservationId);
        } catch (err: any) {
          toast.error("Gagal memproses pembayaran", {
            description: "Coba beberapa saat lagi",
            id: "process-payment",
          });
        }
      },

      onError: (errors) => {
        toast.warning("Reservasi gagal ditambahkan", {
          id: "create-reservation",
          description: errors.message,
        });
      },
    });
  }

  /**
   * Get snap token from `PaymentController` to show payment snap window
   *
   * @param reservationId - reservation id
   * @returns snap token
   */
  async function getSnapToken(reservationId: string): Promise<string> {
    try {
      const response = await fetch("/reservasi/snap-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ?? "",
        },
        body: JSON.stringify({ reservation_id: reservationId }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Gagal mendapatkan snap token");
      }

      const data = await response.json();
      return data.snap_token;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Show payment snap window then update reservation payment data
   *
   * @param snapToken - snap token from `getSnapToken`
   * @param reservationId - reservation id
   */
  function processPayment(snapToken: string, reservationId: string) {
    if (!window.snap) {
      toast.error("Pembayaran belum dapat diproses", {
        description: "Coba beberapa saat lagi",
        id: "process-payment",
      });
      return;
    }

    window.snap.pay(snapToken, {
      onSuccess: async (result: MidtransResult) => {
        toast.success("Pembayaran berhasil dilakukan", {
          id: "process-payment",
        });

        try {
          toast.loading("Memperbarui data reservasi", { id: "update-reservation" });

          await router.put(route("public.reservation.payment", reservationId), {
            transaction_status: result.transaction_status,
            transaction_id: result.transaction_id,
            transaction_time: result.transaction_time,
            payment_type: result.payment_type,
            snap_token: snapToken,
            transaction_bank: result.bank ?? "",
          });

          toast.success("Data reservasi berhasil diperbarui", {
            id: "update-reservation",
          });
        } catch (err) {
          toast.error("Data reservasi gagal diperbarui", {
            id: "update-reservation",
          });
        }
      },

      onPending: () => {
        toast.info("Pembayaran sedang diproses", {
          id: "process-payment",
        });
      },

      onError: (err: any) => {
        toast.error("Pembayaran gagal", {
          id: "process-payment",
          description: err,
        });
      },
    });
  }

  // handle midtrans payment snap script
  useEffect(() => {
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

    if (!clientKey) {
      toast.error("Terjadi kesalahan melakukan pembayaran", {
        description: "Silakan hubungi admin",
      });
      return;
    }

    const script = document.createElement("script");
    script.src = `https://app.sandbox.midtrans.com/snap/snap.js`;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // summary data list
  const summaryDataList = [
    {
      label: "Tipe Kamar",
      value: (
        <div className="capitalize">
          {roomType.name} - {smokingTypeSelected}
        </div>
      ),
    },
    {
      label: "Breakfast",
      value: includeBreakfast ? "Include Breakfast" : "Exclude Breakfast",
    },
    {
      label: "Payment",
      value: <span className="capitalize">{selectedPayment === "now" ? "Pay Now" : "Pay at Check-in"}</span>,
    },
  ];

  useEffect(() => {
    if (user) {
      setData((prev: Reservation.Create) => ({
        ...prev,
        name: user.name ?? "",
        email: user.email ?? "",
        nik_passport: user.guest?.nik_passport ?? "",
        phone: user.guest?.phone ?? "",
        gender: user.guest?.gender ?? ("" as Enum.Gender),
        profession: user.guest?.profession ?? "",
        nationality: user.guest?.nationality ?? "",
        address: user.guest?.address ?? "",
        country: user.guest?.country ?? "",
      }));

      if (user.guest?.birthdate) {
        setData("birthdate", new Date(user.guest.birthdate as Date));
      }

      setSelectedNationality(nationalities.find((nationality) => nationality.name === user.guest?.nationality)?.id ?? "");
    }
  }, [user]);

  function SummaryCard({ className }: { className?: string }) {
    return (
      <Card className={cn("h-fit gap-4", className)}>
        <CardHeader>
          <CardTitle className="text-lg">Reservasi</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="flex h-full flex-col justify-center gap-3">
          <div>
            <div className="text-lg font-medium">
              {formatStartDate} - {formatEndDate}
            </div>
            <div className="text-muted-foreground text-base/tight">
              {lengthOfStay} malam - {adults} dewasa, {children} anak
            </div>
          </div>
          <DataList
            data={summaryDataList}
            className="flex flex-col gap-0 *:[dd]:text-base *:[dd]:not-last:mb-2 *:[dt]:text-xs *:[dt]:tracking-widest"
          />
        </CardContent>
        <Separator />
        <CardFooter className="flex flex-col items-start gap-6">
          <dl>
            <dt className="text-muted-foreground text-sm">Total Harga</dt>
            <dd className="text-2xl font-semibold">{formatCurrency(totalPrice)}</dd>
          </dl>

          {!user && (
            <Alert
              variant="destructive"
              className="-mb-3"
            >
              <AlertCircleIcon />
              <AlertTitle>Login terlebih dahulu</AlertTitle>
            </Alert>
          )}

          <SubmitButton
            disabled={processing || !user}
            loading={processing}
            loadingText="Membuat reservasi..."
            onClick={handleCreateReservation}
            className="w-full disabled:cursor-not-allowed"
          >
            Reservasi Kamar
          </SubmitButton>
        </CardFooter>
      </Card>
    );
  }

  return (
    <GuestLayout>
      <Head title="Reservasi Kamar" />
      <div className="container mx-auto space-y-5 pb-10 lg:px-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Reservasi Kamar</h1>
        </div>

        <div className="relative grid grid-cols-1 gap-5 lg:grid-cols-[1fr_auto]">
          <div className="flex flex-col gap-5">
            {/* room details */}
            <Card className="gap-2">
              <CardContent className="grid grid-cols-1 gap-5 lg:grid-cols-[auto_1fr]">
                <ImageContainer
                  src={roomType.formatted_images?.[0] ?? ""}
                  className="h-40 w-full lg:size-40"
                />

                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-[1fr_auto] gap-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">{roomType.name} Room</h3>

                      <div className="grid grid-cols-1 grid-rows-3 gap-x-8 gap-y-1 lg:grid-flow-col lg:grid-cols-[repeat(2,max-content)]">
                        {/* capacity */}
                        <div className="flex items-center gap-2">
                          <UsersRoundIcon className="text-primary size-4" />
                          <span className="text-muted-foreground text-sm">up to {roomType.capacity} guests</span>
                        </div>

                        {/* size */}
                        <div className="flex items-center gap-2">
                          <Maximize2Icon className="text-primary size-4" />
                          <span className="text-muted-foreground text-sm">
                            {roomType.size} m <sup className="-ms-px">2</sup>
                          </span>
                        </div>

                        {/* bed type */}
                        <div className="flex items-center gap-2">
                          <BedIcon className="text-primary size-4" />
                          <span className="text-muted-foreground text-sm">{roomType.bed_type?.name}</span>
                        </div>

                        {/* cancellation policy */}
                        <div className="flex items-center gap-2">
                          <CircleSlashIcon className="text-primary size-4" />
                          <Link
                            href="#"
                            className="text-muted-foreground text-sm underline-offset-2 hover:underline"
                          >
                            Cancellation Policy
                          </Link>
                        </div>

                        {/* payment */}
                        <div className="flex items-center gap-2">
                          <WalletIcon className="text-primary size-4" />
                          <div className="text-muted-foreground text-sm">Payment at Check-in</div>
                        </div>
                      </div>
                    </div>

                    {/* price */}
                    <div className="flex flex-col items-end">
                      <div className="text-foreground text-xl">{formatCurrency(Number(roomType.base_rate))}</div>
                      <p className="text-muted-foreground text-sm">price for 1 night</p>
                    </div>
                  </div>

                  {/* facility */}
                  <Separator className="my-auto" />
                  <div className="grid grid-cols-[auto_1fr] gap-2">
                    <span className="text-foreground">Fasilitas:</span>
                    <div className="text-muted-foreground line-clamp-2 text-pretty whitespace-pre-wrap">
                      {roomType.facility?.length && roomType.facility.length > 0
                        ? roomType.facility.map((facility) => facility.name).join(", ")
                        : "-"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* customer details */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">Detail Tamu</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent
                className={cn("relative grid gap-5 md:grid-cols-2 xl:grid-cols-3", {
                  "*:not-[#overlay]:pointer-events-none *:not-[#overlay]:select-none": !user,
                })}
              >
                {/* fullname */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="name"
                    required
                  >
                    Nama Lengkap
                  </Label>
                  <Input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    className="w-full"
                    placeholder="Input Nama Lengkap"
                    autoComplete="off"
                    required
                  />
                  <InputError message={errors.name} />
                </div>

                {/* phone */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="phone"
                    required
                  >
                    No. HP
                  </Label>
                  <Input
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData("phone", e.target.value)}
                    className="w-full"
                    placeholder="Input No. HP"
                    autoComplete="off"
                    required
                  />
                  <InputError message={errors.phone} />
                </div>

                {/* email */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="email"
                    required
                  >
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    className="w-full"
                    placeholder="Input Email"
                    autoComplete="off"
                    required
                  />
                  <InputError message={errors.email} />
                </div>

                {/* birthdate */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="birthdate"
                    required
                  >
                    Tanggal Lahir
                  </Label>
                  <InputDate
                    mode="single"
                    className="w-full"
                    value={data.birthdate as Date}
                    onChange={(date) => setData("birthdate", date as Date)}
                    disabledDate={{ after: new Date() }}
                    defaultMonth={initialBirthdateYear}
                  />
                  <InputError message={errors.birthdate} />
                </div>

                {/* gender */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="gender"
                    required
                  >
                    Jenis Kelamin
                  </Label>
                  <Select
                    value={data.gender}
                    onValueChange={(value) => setData("gender", value as Enum.Gender)}
                    required
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Pilih Jenis Kelamin">
                        <span className="capitalize">{data.gender === "male" ? "Pria" : "Wanita"}</span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map((gender) => (
                        <SelectItem
                          key={gender}
                          value={gender}
                          className="capitalize"
                        >
                          {gender === "male" ? "Pria" : "Wanita"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <InputError message={errors.gender} />
                </div>

                {/* nik passport */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="nik_passport"
                    optional
                  >
                    NIK/Passport
                  </Label>
                  <Input
                    type="text"
                    value={data.nik_passport}
                    onChange={(e) => setData("nik_passport", e.target.value)}
                    placeholder="Input NIK/Passport"
                    className="w-full"
                  />
                  <InputError message={errors.nik_passport} />
                </div>

                {/* nationality */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="nationality"
                    required
                  >
                    Kewarganegaraan
                  </Label>
                  <Select
                    value={selectedNationality}
                    onValueChange={(value) => {
                      setSelectedNationality(value);
                      setData("nationality", nationalities.find((nationality) => nationality.id === value)?.name || "");
                    }}
                    required
                  >
                    <SelectTrigger id="nationality">
                      <SelectValue placeholder="Pilih Kewarganegaraan">
                        <span className="capitalize">{data.nationality}</span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {nationalities.map((nationality) => (
                        <SelectItem
                          key={nationality.id}
                          value={nationality.id}
                          className="capitalize"
                        >
                          {nationality.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <InputError message={errors.nationality} />
                </div>

                {/* address */}
                <div className="flex flex-col gap-2 xl:col-span-2">
                  <Label
                    htmlFor="address"
                    optional
                  >
                    Alamat
                  </Label>
                  <Input
                    type="text"
                    value={data.address}
                    onChange={(e) => setData("address", e.target.value)}
                    className="w-full"
                    placeholder="Input Alamat"
                    autoComplete="off"
                  />
                  <InputError message={errors.address} />
                </div>

                {!user && (
                  <div
                    id="overlay"
                    className="bg-background/5 absolute inset-x-0 -inset-y-6 flex flex-col items-center justify-center gap-5 backdrop-blur-[2px]"
                  >
                    <Alert
                      variant="destructive"
                      className="w-1/2 shadow-md"
                    >
                      <AlertCircleIcon />
                      <AlertTitle>Login terlebih dahulu</AlertTitle>
                      <AlertDescription>
                        <p>
                          Silakan{" "}
                          <PublicLogin>
                            <DialogTrigger className="decoration-muted-foreground hover:decoration-foreground cursor-pointer underline underline-offset-4">
                              Login
                            </DialogTrigger>
                          </PublicLogin>{" "}
                          terlebih dahulu untuk membuat reservasi kamar
                        </p>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preferensi</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="grid gap-5 lg:grid-cols-2">
                {/* smoking type */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="smoking_type"
                    required
                  >
                    Smoking Type
                  </Label>
                  <Select
                    defaultValue={"non smoking" as Enum.SmokingType}
                    value={data.smoking_type}
                    onValueChange={(value) => {
                      setSmokingTypeSelected(value as Enum.SmokingType);
                      setData("smoking_type", value as Enum.SmokingType);
                    }}
                    required
                  >
                    <SelectTrigger id="smoking_type">
                      <SelectValue placeholder="Pilih Jenis Rokok" />
                    </SelectTrigger>
                    <SelectContent>
                      {smokingTypes.map((smokingType) => (
                        <SelectItem
                          key={smokingType}
                          value={smokingType}
                        >
                          {smokingType} room
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <InputError message={errors.smoking_type} />
                </div>

                {/* include breakfast */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="include_breakfast"
                    required
                  >
                    Breakfast
                  </Label>
                  <Button
                    variant="outline"
                    asChild
                  >
                    <Label
                      htmlFor="include_breakfast"
                      className="bg-accent ms-auto w-full px-3"
                    >
                      <span>Include Breakfast</span>
                      <span className="text-muted-foreground">- Untuk {roomType.capacity} tamu</span>
                      <Switch
                        id="include_breakfast"
                        checked={includeBreakfast}
                        onCheckedChange={(value) => {
                          setIncludeBreakfast(value);
                          setData("include_breakfast", value);

                          if (value) {
                            setData("total_price", Number(roomType.base_rate) + BASE_BREAKFAST_RATE);
                          } else {
                            setData("total_price", Number(roomType.base_rate));
                          }
                        }}
                        className="ms-auto"
                      />
                    </Label>
                  </Button>
                  <InputError message={errors.include_breakfast} />
                </div>

                {/* personal request */}
                <div className="col-span-full flex flex-col gap-2">
                  <Label htmlFor="remarks">Personal Request</Label>
                  <Textarea
                    id="remarks"
                    value={data.remarks}
                    onChange={(e) => setData("remarks", e.target.value)}
                    placeholder="If you have any special needs, please feel free to share them with use. We'll do our best to help you"
                    className="w-full"
                  />
                  <InputError message={errors.remarks} />
                </div>
              </CardContent>
            </Card>

            {/* payment */}
            <Card className="gap-4">
              <CardHeader>
                <CardTitle className="text-lg">Pembayaran</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-pretty">
                  By proceeding with the booking, you give your Consent to personal data processing and confirm that you have read the Online booking
                  rules and the Privacy policy
                </p>

                <Alert className="border-blue-200 bg-blue-100 dark:border-blue-950 dark:bg-slate-900">
                  <InfoIcon className="!text-blue-500 dark:!text-blue-600" />
                  <AlertTitle className="tracking-wide">
                    No need to pay for your stay right now!
                    <Link
                      href="#"
                      className="ms-1 text-sm underline underline-offset-2"
                    >
                      Cancellation Policy
                    </Link>
                  </AlertTitle>
                </Alert>

                {/* payment method */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="payment_method"
                    required
                  >
                    Select Payment Method
                  </Label>
                  <RadioGroup
                    value={selectedPayment}
                    onValueChange={setSelectedPayment}
                    className="*:border-input *:w-full *:space-y-3 *:rounded-md *:border *:p-4"
                    required
                  >
                    <Label
                      htmlFor="now"
                      role="button"
                      className="has-data-[state=checked]:dark:border-primary/50 has-data-[state=checked]:bg-accent has-data-[state=checked]:border-primary hover:bg-accent/50 cursor-pointer"
                    >
                      <RadioGroupItem
                        value="now"
                        id="now"
                        className="hidden"
                      />
                      <div className="text-base font-semibold">Pay Now</div>
                      <p className="text-muted-foreground leading-normal">
                        By selecting this payment method, you will be directed to make a payment. You can choose the type of payment you want based on
                        the available options.
                      </p>
                    </Label>
                    <Label
                      htmlFor="later"
                      role="button"
                      className="has-data-[state=checked]:dark:border-primary/50 has-data-[state=checked]:bg-accent has-data-[state=checked]:border-primary hover:bg-accent/50 cursor-pointer"
                    >
                      <RadioGroupItem
                        value="later"
                        id="later"
                        className="hidden"
                      />
                      <div className="text-base font-semibold">Pay at Check-in</div>
                      <p className="text-muted-foreground leading-normal">
                        By selecting this payment method, you don't need to prepay for your stay.
                      </p>
                    </Label>
                  </RadioGroup>
                  <InputError message={errors.payment_method} />
                </div>
              </CardContent>
            </Card>

            {/* summary - mobile */}
            <SummaryCard className="w-full lg:hidden" />
          </div>

          {/* summary - desktop */}
          <SummaryCard className="sticky top-17 w-72 max-lg:hidden" />
        </div>
      </div>
    </GuestLayout>
  );
}
