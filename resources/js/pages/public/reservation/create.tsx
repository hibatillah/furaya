import { ImageContainer } from "@/components/image";
import { InputDate } from "@/components/input-date";
import InputError from "@/components/input-error";
import SelectCountry from "@/components/select-country";
import { SubmitButton } from "@/components/submit-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import {
  AlertCircleIcon,
  BanknoteIcon,
  BedIcon,
  BedSingleIcon,
  CalendarRangeIcon,
  CigaretteIcon,
  CigaretteOffIcon,
  CircleSlashIcon,
  InfoIcon,
  MailIcon,
  MapPinIcon,
  MarsIcon,
  Maximize2Icon,
  QrCodeIcon,
  Settings2Icon,
  SmartphoneIcon,
  SquareUserRoundIcon,
  UserRoundIcon,
  UsersRoundIcon,
  UtensilsIcon,
  VenusIcon,
  WalletCardsIcon,
  WalletIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import PublicLogin from "../auth/login";

interface PublicReservationCreateProps {
  roomType: RoomType.Default;
  genders: Enum.Gender[];
  countries: {
    code: string;
    name: string;
  }[];
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
  const { roomType, genders, countries, smokingTypes, startDate, endDate, adults, children, lengthOfStay, user } = props;

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
        const bookingNumber = page.props.flash?.data?.booking_number;

        if (!reservationId) {
          toast.error("Gagal mendapatkan ID reservasi", {
            id: "create-reservation",
          });
          return;
        }

        toast.success("Reservasi berhasil ditambahkan", {
          id: "create-reservation",
        });

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

        // redirect to history page
        setTimeout(() => {
          router.get(
            route("public.reservation.history", {
              search: bookingNumber,
            }),
          );
        }, 1000);
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
        nationality_code: user.guest?.nationality_code ?? " ",
        address: user.guest?.address ?? "",
        country: user.guest?.country ?? "",
        country_code: user.guest?.country_code ?? "",
      }));

      if (user.guest?.birthdate) {
        setData("birthdate", new Date(user.guest.birthdate as Date));
      }

      setSelectedNationality(user.guest?.nationality ?? "");
    }
  }, [user]);

  function SummaryCard({ className }: { className?: string }) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className={className}>Cek Reservasi</Button>
        </DialogTrigger>
        <DialogContent
          className="lg:!max-w-2xl"
          noClose
        >
          <DialogHeader>
            <DialogTitle>Ringkasan Reservasi</DialogTitle>
          </DialogHeader>
          <Separator />
          <dl className="**:[svg]:text-primary! **:data-[slot=separator]:text-muted-foreground/80 relative space-y-3 **:data-[slot=separator]:mx-2 *:[dd]:flex *:[dd]:items-start *:[dd]:gap-3 *:[dd]:lg:items-center **:[svg]:size-4 **:[svg]:max-lg:mt-[5px]">
            <dd>
              <UserRoundIcon />
              <div>
                {data.name}
                <span data-slot="separator">|</span>
                {data.phone}
              </div>
            </dd>
            <dd>
              <CalendarRangeIcon />
              <div>
                {format(data.start_date as Date, "dd MMMM yyyy", dateConfig)} - {format(data.end_date as Date, "dd MMMM yyyy", dateConfig)}
                <span data-slot="separator">|</span>
                {data.length_of_stay} malam
              </div>
            </dd>
            <dd>
              <BedSingleIcon />
              <div>
                Kamar {data.room_type_name}
                <span data-slot="separator">|</span>
                {data.adults} dewasa, {data.children} anak
              </div>
            </dd>
            <dd>
              <Settings2Icon />
              <div className="capitalize">
                {data.smoking_type}
                <span data-slot="separator">|</span>
                {data.include_breakfast ? "Termasuk Sarapan" : "Tanpa Sarapan"}
              </div>
            </dd>
            <dd>
              <WalletCardsIcon />
              <div className="capitalize">{selectedPayment === "now" ? "Bayar Sekarang" : "Bayar saat Check-in"}</div>
            </dd>
            <div className="end-0 top-0 flex flex-col items-end lg:absolute">
              <div className="text-3xl font-bold">{formatCurrency(totalPrice)}</div>
            </div>
          </dl>
          <Separator />
          <DialogFooter className="flex flex-col gap-3 lg:flex-row">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="max-lg:order-2"
              >
                Kembali
              </Button>
            </DialogClose>

            {/* submit */}
            <SubmitButton
              disabled={processing || !user}
              loading={processing}
              loadingText="Membuat reservasi..."
              onClick={handleCreateReservation}
              className="disabled:cursor-not-allowed"
            >
              {selectedPayment === "later" ? "Buat Reservasi" : "Bayar Reservasi"}
            </SubmitButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <GuestLayout>
      <Head title="Reservasi Kamar" />
      <div className="container mx-auto space-y-5 pb-20 lg:px-12">
        <div className="flex flex-col gap-5 **:data-[slot=card]:gap-3! lg:mx-auto lg:max-w-5xl">
          <h1 className="text-2xl font-bold">Reservasi Kamar</h1>

          {/* room details */}
          <Card className="gap-2">
            <CardContent className="grid grid-cols-1 gap-8 lg:grid-cols-[auto_1fr]">
              <ImageContainer
                src={roomType.formatted_images?.[0] ?? ""}
                className="h-40 w-full lg:w-60"
              />

              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-[1fr_auto] gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">{roomType.name}</h3>

                    <div className="grid grid-cols-1 grid-rows-3 gap-x-16 gap-y-1 lg:grid-flow-col lg:grid-cols-[repeat(2,max-content)]">
                      {/* capacity */}
                      <div className="flex items-center gap-2">
                        <UsersRoundIcon className="text-primary size-4" />
                        <span className="text-muted-foreground text-sm">hingga {roomType.capacity} tamu</span>
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
                        <span className="text-muted-foreground text-sm">{roomType.bed_type?.name} Bed</span>
                      </div>

                      {/* cancellation policy */}
                      <div className="flex items-center gap-2">
                        <CircleSlashIcon className="text-primary size-4" />
                        <Link
                          href="#"
                          className="text-muted-foreground text-sm underline-offset-2 hover:underline"
                        >
                          Kebijakan Pembatalan
                        </Link>
                      </div>

                      {/* payment */}
                      <div className="flex items-center gap-2">
                        <WalletIcon className="text-primary size-4" />
                        <div className="text-muted-foreground text-sm">Pembayaran saat Check-in</div>
                      </div>
                    </div>
                  </div>

                  {/* price */}
                  <div className="flex flex-col items-end">
                    <div className="text-foreground text-3xl font-bold">{formatCurrency(Number(roomType.base_rate))}</div>
                    <p className="text-muted-foreground">harga per malam</p>
                  </div>
                </div>

                {/* facility */}
                <Separator className="my-auto" />
                <div className="grid grid-cols-[auto_1fr] gap-2">
                  <span className="text-foreground">Fasilitas:</span>
                  <div className="text-muted-foreground line-clamp-2 text-pretty whitespace-pre-wrap">
                    {roomType.facility?.length && roomType.facility.length > 0 ? roomType.facility.map((facility) => facility.name).join(", ") : "-"}
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
                <div className="relative">
                  <UserRoundIcon className="text-primary absolute start-3 top-1/2 z-10 size-4 -translate-y-1/2" />
                  <Input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    className="w-full ps-9"
                    autoComplete="off"
                    required
                    disabled={!user}
                  />
                </div>
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
                <div className="relative">
                  <SmartphoneIcon className="text-primary absolute start-3 top-1/2 z-10 size-4 -translate-y-1/2" />
                  <Input
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData("phone", e.target.value)}
                    className="w-full ps-9"
                    autoComplete="off"
                    required
                    disabled={!user}
                  />
                </div>
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
                <div className="relative">
                  <MailIcon className="text-primary absolute start-3 top-1/2 z-10 size-4 -translate-y-1/2" />
                  <Input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    className="w-full ps-9"
                    autoComplete="off"
                    required
                    disabled={!user}
                  />
                </div>
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
                  disabled={!user}
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
                  disabled={!user}
                >
                  <SelectTrigger id="gender">
                    <SelectValue>
                      <span className="flex items-center gap-2 capitalize">
                        {data.gender === "male" ? (
                          <>
                            <MarsIcon className="text-primary size-4" />
                            Pria
                          </>
                        ) : (
                          <>
                            <VenusIcon className="text-primary size-4" />
                            Wanita
                          </>
                        )}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {genders.map((gender) => (
                      <SelectItem
                        key={gender}
                        value={gender}
                        className="capitalize"
                      >
                        {gender === "male" ? (
                          <>
                            <MarsIcon className="text-primary size-4" />
                            Pria
                          </>
                        ) : (
                          <>
                            <VenusIcon className="text-primary size-4" />
                            Wanita
                          </>
                        )}
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
                <div className="relative">
                  <SquareUserRoundIcon className="text-primary absolute start-3 top-1/2 z-10 size-4 -translate-y-1/2" />
                  <Input
                    type="text"
                    value={data.nik_passport}
                    onChange={(e) => setData("nik_passport", e.target.value)}
                    className="w-full ps-9"
                    disabled={!user}
                  />
                </div>
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
                <SelectCountry
                  label="Kewarganegaraan"
                  data={countries}
                  value={selectedNationality}
                  setValue={({ code, name }) => {
                    setSelectedNationality(name);
                    setData((prev) => ({
                      ...prev,
                      nationality: name,
                      nationality_code: code,
                    }));
                  }}
                  disabled={!user}
                />
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
                <div className="relative">
                  <MapPinIcon className="text-primary absolute start-3 top-1/2 z-10 size-4 -translate-y-1/2" />
                  <Input
                    type="text"
                    value={data.address}
                    onChange={(e) => setData("address", e.target.value)}
                    className="w-full ps-9"
                    autoComplete="off"
                    disabled={!user}
                  />
                </div>
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
                  Kamar - Smoking Type
                </Label>
                <Select
                  defaultValue={"non smoking" as Enum.SmokingType}
                  value={data.smoking_type}
                  onValueChange={(value) => {
                    setSmokingTypeSelected(value as Enum.SmokingType);
                    setData("smoking_type", value as Enum.SmokingType);
                  }}
                  required
                  disabled={!user}
                >
                  <SelectTrigger id="smoking_type">
                    <SelectValue placeholder="Pilih Kamar - Smoking Type">
                      <span className="flex items-center gap-3 capitalize">
                        {data.smoking_type === "smoking" ? (
                          <>
                            <CigaretteIcon className="text-primary size-4" />
                            Smoking
                          </>
                        ) : (
                          <>
                            <CigaretteOffIcon className="text-primary size-4" />
                            Non Smoking
                          </>
                        )}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {smokingTypes.map((smokingType) => (
                      <SelectItem
                        key={smokingType}
                        value={smokingType}
                      >
                        {smokingType === "smoking" ? (
                          <>
                            <CigaretteIcon className="text-primary size-4" />
                            Smoking
                          </>
                        ) : (
                          <>
                            <CigaretteOffIcon className="text-primary size-4" />
                            Non Smoking
                          </>
                        )}
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
                  Sarapan
                </Label>
                <Button
                  variant="outline"
                  disabled={!user}
                  asChild
                >
                  <Label
                    htmlFor="include_breakfast"
                    className="bg-accent ms-auto w-full px-3"
                  >
                    <UtensilsIcon className="text-primary size-4" />
                    <span className="text-foreground">Termasuk Sarapan</span>
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
                      disabled={!user}
                    />
                  </Label>
                </Button>
                <InputError message={errors.include_breakfast} />
              </div>

              {/* personal request */}
              <div className="col-span-full flex flex-col gap-2">
                <Label htmlFor="remarks">Permintaan Pribadi</Label>
                <Textarea
                  id="remarks"
                  value={data.remarks}
                  onChange={(e) => setData("remarks", e.target.value)}
                  className="w-full"
                  disabled={!user}
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
                Dengan melanjutkan pemesanan, Anda memberikan persetujuan untuk pemrosesan data pribadi dan mengkonfirmasi bahwa Anda telah membaca
                aturan pemesanan online dan kebijakan privasi
              </p>

              <Alert className="border-blue-200 bg-blue-100 dark:border-blue-950 dark:bg-slate-900">
                <InfoIcon className="!text-blue-500 dark:!text-blue-600" />
                <AlertTitle className="tracking-wide">
                  Tidak perlu membayar untuk penginapan Anda sekarang!
                  <Link
                    href="#"
                    className="ms-1 text-sm underline underline-offset-2"
                  >
                    Kebijakan Pembatalan
                  </Link>
                </AlertTitle>
              </Alert>

              {/* payment method */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="payment_method"
                  required
                >
                  Pilih Metode Pembayaran
                </Label>
                <RadioGroup
                  value={selectedPayment}
                  onValueChange={setSelectedPayment}
                  className="*:border-input *:w-full *:space-y-3 *:rounded-md *:border *:p-4"
                  required
                >
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
                    <div className="flex items-center gap-2">
                      <BanknoteIcon className="text-primary size-5" />
                      <div className="text-base font-semibold">Bayar saat Check-in</div>
                    </div>
                    <p className="text-muted-foreground leading-normal">
                      Dengan memilih metode pembayaran ini, Anda tidak perlu membayar untuk penginapan Anda sekarang.
                    </p>
                  </Label>
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
                    <div className="flex items-center gap-2">
                      <QrCodeIcon className="text-primary size-5" />
                      <div className="text-base font-semibold">Bayar Sekarang</div>
                    </div>
                    <p className="text-muted-foreground leading-normal">
                      Dengan memilih metode pembayaran ini, Anda akan diarahkan untuk melakukan pembayaran. Anda dapat memilih jenis pembayaran yang
                      Anda inginkan berdasarkan pilihan yang tersedia.
                    </p>
                  </Label>
                </RadioGroup>
                <InputError message={errors.payment_method} />
              </div>
            </CardContent>
          </Card>

          <Separator />
          <SummaryCard className="w-full md:ms-auto md:w-40 xl:w-60" />
        </div>
      </div>
    </GuestLayout>
  );
}
