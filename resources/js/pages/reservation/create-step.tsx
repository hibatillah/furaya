import { InfoTooltip } from "@/components/info-tooltip";
import { InputDate, type InputDate as InputDateType } from "@/components/input-date";
import InputError from "@/components/input-error";
import SelectCountry from "@/components/select-country";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Stepper, StepperIndicator, StepperItem, StepperSeparator, StepperTitle } from "@/components/ui/stepper";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import AppLayout from "@/layouts/app-layout";
import { formatCurrency } from "@/lib/utils";
import { dateConfig } from "@/static";
import { BASE_BREAKFAST_RATE, MAX_LENGTH_OF_STAY, MIN_ADVANCE_AMOUNT, MIN_LENGTH_OF_STAY, MIN_PAX } from "@/static/reservation";
import { BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { addDays, addYears, differenceInCalendarDays, format, isAfter, isSameDay } from "date-fns";
import { BedDoubleIcon, CalendarRangeIcon, ChevronRightIcon, Settings2Icon, UserRoundIcon, UserSearchIcon, WalletCardsIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ReservationCreateProps } from "./create";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Reservasi",
    href: route("reservation.index"),
  },
  {
    title: "Tambah Reservasi",
    href: route("reservation.create"),
  },
];

const steps = [
  {
    step: 1,
    title: "Detail Reservasi",
  },
  {
    step: 2,
    title: "Detail Kamar",
  },
  {
    step: 3,
    title: "Data Tamu",
  },
  {
    step: 4,
    title: "Pembayaran",
  },
];

function StepperNavigation({
  step,
  setStep,
  children,
  disabledPrev,
  disabledNext,
}: {
  step: number;
  setStep: (step: number) => void;
  disabledPrev?: boolean;
  disabledNext?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <CardFooter className="flex items-center justify-end gap-3">
      {step > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStep(step - 1)}
          disabled={step === 1 || disabledPrev}
        >
          <span>Kembali</span>
        </Button>
      )}
      {step < steps.length && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStep(step + 1)}
          disabled={step === steps.length || disabledNext}
          className="max-lg:ms-auto"
        >
          <span>Selanjutnya</span>
          <ChevronRightIcon className="-me-1 size-4" />
        </Button>
      )}
      {children}
    </CardFooter>
  );
}

export default function ReservationCreateStep(props: ReservationCreateProps) {
  const { visitPurposes, bookingTypes, roomPackages, paymentMethods, genders, employee, guestTypes, countries, smokingTypes } = props;

  // declare form
  const [step, setStep] = useState(1);
  const [summaryDialogOpen, setSummaryDialogOpen] = useState<boolean>(false);

  const initialStartDate = new Date();
  const initialEndDate = addDays(initialStartDate, 1);
  const initialBirthdateYear = addYears(initialStartDate, -17); // Customer must be at least 17 years old

  const [startDate, setStartDate] = useState<InputDateType>(initialStartDate);
  const [endDate, setEndDate] = useState<InputDateType>(initialEndDate);
  const [selectedRoomType, setSelectedRoomType] = useState<string | undefined>(undefined);
  const [availableRoomTypes, setAvailableRoomTypes] = useState<RoomType.Default[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room.Default[]>([]);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<Room.Default | undefined>(undefined);
  const [selectedGuestType, setSelectedGuestType] = useState<string | undefined>(undefined);
  const [selectedNationality, setSelectedNationality] = useState<string | undefined>(undefined);
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined);
  const [includeBreakfast, setIncludeBreakfast] = useState<boolean>(true);

  const { data, setData, post, processing, errors, isDirty } = useForm<Reservation.Create>({
    // reservation data
    start_date: startDate as Date,
    end_date: endDate as Date,
    length_of_stay: MIN_LENGTH_OF_STAY,
    adults: 1,
    status: "pending" as Enum.ReservationStatus,
    pax: MIN_PAX,
    total_price: 0,
    children: 0,
    arrival_from: "",
    guest_type: "",
    employee_name: employee.user?.name || "",
    employee_id: employee.id,
    booking_type: "" as Enum.BookingType,
    visit_purpose: "" as Enum.VisitPurpose,
    room_package: "" as Enum.RoomPackage,
    payment_method: "" as Enum.Payment,
    status_acc: "approved" as Enum.StatusAcc,
    discount: "",
    discount_reason: "",
    commission_percentage: "",
    commission_amount: "",
    remarks: "",
    advance_remarks: "",
    advance_amount: MIN_ADVANCE_AMOUNT,
    smoking_type: "" as Enum.SmokingType,
    include_breakfast: includeBreakfast,

    // guest data
    name: "",
    email: "",
    nik_passport: "",
    phone: "",
    gender: "" as Enum.Gender,
    birthdate: "",
    profession: "",
    nationality: "",
    nationality_code: "",
    country: "",
    country_code: "",
    address: "",

    // room data
    room_id: "",
    room_number: "",
    room_type_id: "",
    room_type_name: "",
    room_rate: "",
    bed_type: "",
    view: "",
  });

  /**
   * Get customer data
   * apply to form based on nik_passport
   */
  const getCustomer = useCallback(
    async (value: string) => {
      try {
        toast.loading("Mencari data tamu tersedia...", { id: "get-guest" });

        const response = await fetch(`/admin/reservasi/tamu?phone=${encodeURIComponent(value)}`);
        const data = await response.json();
        const guest = data.guest as Guest.Default;

        if (guest) {
          setSelectedNationality(guest.nationality);
          setSelectedCountry(guest.country);

          // apply guest data to form
          setData((prev) => ({
            ...prev,
            name: guest.user?.name || "",
            email: guest.user?.email || "",
            phone: guest.phone || "",
            gender: guest.gender || "",
            birthdate: new Date(guest.birthdate) || "",
            profession: guest.profession || "",
            nationality: guest.nationality || "",
            nationality_code: guest.nationality_code || "",
            country: guest.country || "",
            country_code: guest.country_code || "",
            address: guest.address || "",
          }));

          toast.success("Tamu ditemukan", {
            id: "get-guest",
            description: "Data tamu diterapkan ke form",
          });
        } else {
          toast.warning("Tamu tidak ditemukan", {
            id: "get-guest",
            description: `Tamu dengan no. hp ${value} tidak ditemukan`,
          });
        }
      } catch (error) {
        toast.error("Terjadi Kesalahan", {
          id: "get-guest",
          description: "Tamu tak ditemukan.",
        });
      }
    },
    [data.phone],
  );

  /**
   * Get available rooms
   * based on room type, start date, end date
   */
  const getAvailableRooms = useCallback(
    async (roomTypeId: string) => {
      try {
        const start = format(startDate as Date, "yyyy-MM-dd");
        const end = format(endDate as Date, "yyyy-MM-dd");

        const response = await fetch(`/admin/reservasi/kamar/tersedia?start=${start}&end=${end}&room_type_id=${roomTypeId}`);

        const data = await response.json();

        if (!data.error) {
          setAvailableRooms(data.rooms as Room.Default[]);
        } else {
          toast.warning("Kamar tidak tersedia", {
            id: "get-available-rooms",
            description: data.error,
          });
        }
      } catch (err) {
        toast.error("Terjadi Kesalahan", {
          id: "get-available-rooms",
        });
      }
    },
    [startDate, endDate, selectedRoomType],
  );

  /**
   * Get available room types
   * based on reservation date
   */
  const getAvailableRoomTypes = useCallback(async () => {
    try {
      const start = format(startDate as Date, "yyyy-MM-dd");
      const end = format(endDate as Date, "yyyy-MM-dd");

      const response = await fetch(`/admin/reservasi/tipe-kamar/tersedia?start=${start}&end=${end}`);
      const data = await response.json();

      if (!data.error) {
        setAvailableRoomTypes(data.roomTypes as RoomType.Default[]);
      } else {
        toast.warning("Tipe kamar tidak tersedia", {
          id: "get-available-room-types",
          description: data.error,
        });
      }
    } catch (err) {
      toast.error("Terjadi Kesalahan", {
        id: "get-available-room-types",
      });
    }
  }, [startDate, endDate]);

  /**
   * Set room data
   * based on selected room
   */
  const setRoomData = useCallback(
    (room: Room.Default) => {
      setData((prev: Reservation.Create) => ({
        ...prev,
        room_id: room.id,
        room_number: room.room_number,
        room_type_id: room.room_type_id,
        room_type_name: room.room_type?.name || "",
        room_rate: room.price,
        bed_type: room.bed_type?.name || "",
        view: room.view || "",
      }));
    },
    [selectedRoomNumber, data.room_id],
  );

  /**
   * Calculate breakfast rate
   * based on room capacity, length of stay, and include breakfast
   * @returns number - breakfast rate
   */
  const breakfastRate = useMemo(() => {
    const LoS = data.length_of_stay || 1;
    const breakfastRate = data.include_breakfast ? BASE_BREAKFAST_RATE * (selectedRoomNumber?.capacity || 0) * LoS : 0;

    return breakfastRate;
  }, [selectedRoomNumber, data.length_of_stay, data.include_breakfast]);

  /**
   * Calculate plain price, before discount
   */
  const plainPrice = useMemo(() => {
    const LoS = data.length_of_stay || 1;
    const roomRate = data.room_rate || 0;

    return roomRate * LoS + breakfastRate;
  }, [data.length_of_stay, data.room_rate, breakfastRate]);

  /**
   * Calculate total price
   * based on room rate, length of stay, discount percentage
   * @returns string - price in currency format
   */
  const totalPrice = useMemo(() => {
    const discountPercentage = data.discount || 0;
    const discount = plainPrice * (discountPercentage / 100);
    const discountPrice = plainPrice - discount;

    setData("total_price", discountPrice);
    return formatCurrency(discountPrice);
  }, [plainPrice, data.discount]);

  // handle create reservation
  function handleCreateReservation(e: React.FormEvent) {
    e.preventDefault();

    // sent data
    toast.loading("Menambahkan reservasi...", { id: "create-reservation" });

    post(route("reservation.store"), {
      onError: (errors) => {
        toast.warning("Reservasi gagal ditambahkan", {
          id: "create-reservation",
          description: errors.message,
        });
      },
    });
  }

  /**
   * Update available room types
   * based on start date and end date changes
   */
  useEffect(() => {
    if (startDate && endDate) {
      const start = startDate as Date;
      const end = endDate as Date;

      setData("start_date", format(start, "yyyy-MM-dd"));
      setData("end_date", format(end, "yyyy-MM-dd"));

      getAvailableRoomTypes();
    }
  }, [startDate, endDate]);

  /**
   * Prevent user hard refresh or tab close when form is dirty
   */
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "Perubahan data belum disimpan. Yakin ingin meninggalkan halaman ini?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Reservasi" />

      <Stepper
        value={step}
        onValueChange={setStep}
      >
        {steps.map(({ step: item, title }) => (
          <StepperItem
            key={item}
            step={item}
            className="relative flex-1 flex-col!"
          >
            <StepperIndicator className="not-dark:bg-muted-foreground/50" />
            <div className="mt-2 space-y-0.5 px-2 text-center">
              <StepperTitle className={step === item ? "text-foreground" : "text-muted-foreground"}>{title}</StepperTitle>
            </div>
            {item < steps.length && (
              <StepperSeparator className="absolute not-dark:bg-muted-foreground/50 inset-x-0 top-3 left-[calc(50%+0.75rem+0.125rem)] -order-1 m-0 -translate-y-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none" />
            )}
          </StepperItem>
        ))}
      </Stepper>

      <Tabs
        defaultValue="1"
        value={step.toString()}
        onValueChange={(value) => setStep(Number(value))}
        className="mt-4 **:data-[slot=card]:mx-auto **:data-[slot=card]:max-w-6xl **:data-[slot=card-content]:grid **:data-[slot=card-content]:grid-cols-1 **:data-[slot=card-content]:gap-4 **:data-[slot=card-title]:text-lg **:data-[slot=card-content]:lg:grid-cols-2"
      >
        <TabsContent
          id="detail-reservasi"
          value="1"
        >
          <Card>
            <CardHeader>
              <CardTitle>Detail Reservasi</CardTitle>
            </CardHeader>
            <CardContent>
              {/* start date */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="start_date"
                  required
                >
                  Tanggal Masuk
                </Label>
                <InputDate
                  mode="single"
                  value={startDate}
                  onChange={(date) => {
                    const value = date as Date;
                    setStartDate(value);

                    if (date && endDate) {
                      let newEndDate: Date = endDate as Date;

                      /**
                       * handle endDate
                       *
                       * if startDate is equal or greater than endDate
                       * then set endDate to startDate + 1
                       */
                      if (isAfter(value, endDate as Date) || isSameDay(value, endDate as Date)) {
                        newEndDate = addDays(value, 1);
                        setEndDate(newEndDate);
                      }

                      // handle length of stay
                      const diffDays = differenceInCalendarDays(newEndDate, value);
                      setData("length_of_stay", diffDays as number | "");
                    }
                  }}
                  className="w-full"
                  disabledDate={{ before: initialStartDate }}
                />
                <InputError message={errors.start_date} />
              </div>

              {/* end date */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="end_date"
                  required
                >
                  Tanggal Keluar
                </Label>
                <InputDate
                  mode="single"
                  value={endDate}
                  onChange={(date) => {
                    setEndDate(date);

                    // handle length of stay
                    if (date && startDate) {
                      const diffDays = differenceInCalendarDays(date as Date, startDate as Date);
                      setData("length_of_stay", diffDays as number | "");
                    }
                  }}
                  className="w-full"
                  disabledDate={{ before: addDays((startDate as Date) ?? initialStartDate, 1) }}
                />
                <InputError message={errors.end_date} />
              </div>

              {/* length of stay */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="length_of_stay"
                  required
                >
                  Length of Stay
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    min={MIN_LENGTH_OF_STAY}
                    max={MAX_LENGTH_OF_STAY}
                    value={data.length_of_stay}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setData("length_of_stay", value);

                      // handle end date
                      if (value && startDate) {
                        const newEndDate = addDays(startDate as Date, value);
                        setEndDate(newEndDate);
                      }
                    }}
                    className="w-full"
                    disableHandle
                    required
                  />
                  <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-1 flex items-center px-2 text-sm select-none">
                    hari
                  </span>
                </div>
                <InputError message={errors.length_of_stay} />
              </div>

              {/* arrival from */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="arrival_from">Asal Kedatangan</Label>
                <Input
                  type="text"
                  value={data.arrival_from}
                  onChange={(e) => setData("arrival_from", e.target.value)}
                  className="w-full"
                  required
                />
                <InputError message={errors.arrival_from} />
              </div>

              {/* visit purpose */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="visit_purpose"
                  required
                >
                  Tujuan Kedatangan
                </Label>
                <Select
                  value={data.visit_purpose}
                  onValueChange={(value) => setData("visit_purpose", value as Enum.VisitPurpose)}
                  required
                >
                  <SelectTrigger id="purpose">
                    <SelectValue>
                      <span className="capitalize">{data.visit_purpose}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {visitPurposes.map((purpose) => (
                      <SelectItem
                        key={purpose}
                        value={purpose}
                        className="capitalize"
                      >
                        {purpose}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.visit_purpose} />
              </div>

              {/* booking type */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="booking_type"
                  required
                >
                  Tipe Reservasi
                </Label>
                <Select
                  value={data.booking_type}
                  onValueChange={(value) => setData("booking_type", value as Enum.BookingType)}
                  required
                >
                  <SelectTrigger id="booking_type">
                    <SelectValue>
                      <span className="capitalize">{data.booking_type}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {bookingTypes.map((type) => (
                      <SelectItem
                        key={type}
                        value={type}
                        className="capitalize"
                      >
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.booking_type} />
              </div>

              {/* guest type */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="guest_type"
                  required
                >
                  Tipe Tamu
                </Label>
                <Select
                  value={selectedGuestType}
                  onValueChange={(value) => {
                    setSelectedGuestType(value);
                    setData("guest_type", guestTypes.find((type) => type.id === value)?.name || "");
                  }}
                  required
                >
                  <SelectTrigger id="guest_type">
                    <SelectValue>
                      <span className="capitalize">{data.guest_type}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {guestTypes.map((type) => (
                      <SelectItem
                        key={type.id}
                        value={type.id}
                        className="capitalize"
                      >
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.guest_type} />
              </div>

              {/* remarks */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="remarks"
                  optional
                >
                  Remarks
                </Label>
                <Input
                  type="text"
                  value={data.remarks}
                  onChange={(e) => setData("remarks", e.target.value)}
                  className="w-full"
                  autoComplete="off"
                />
                <InputError message={errors.remarks} />
              </div>
            </CardContent>
            <StepperNavigation
              step={step}
              setStep={setStep}
              disabledNext={
                !data.start_date || !data.end_date || !data.length_of_stay || !data.visit_purpose || !data.booking_type || !data.guest_type
              }
            />
          </Card>
        </TabsContent>

        <TabsContent
          id="detail-kamar"
          value="2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Detail Kamar</CardTitle>
            </CardHeader>
            <CardContent>
              {/* room type */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <Label
                    htmlFor="room_type"
                    required
                  >
                    Tipe Kamar
                  </Label>
                  <InfoTooltip>Opsi hanya menampilkan tipe kamar yang tersedia sesuai tanggal reservasi.</InfoTooltip>
                </div>
                <Select
                  value={selectedRoomType}
                  onValueChange={(value) => {
                    if (!startDate || !endDate) {
                      toast.error("Pilih tanggal masuk dan keluar terlebih dahulu");
                      return;
                    }

                    setSelectedRoomType(value);
                    setSelectedRoomNumber(undefined);
                    getAvailableRooms(value);
                  }}
                  required
                >
                  <SelectTrigger id="room_type">
                    <SelectValue>
                      <span className="capitalize">{availableRoomTypes.find((type) => type.id === selectedRoomType)?.name || ""}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoomTypes.length > 0 ? (
                      availableRoomTypes.map((type) => (
                        <SelectItem
                          key={type.id}
                          value={type.id}
                          className="capitalize"
                          disabled={type.can_delete}
                        >
                          {type.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem
                        value="no-available-room-type"
                        className="text-muted-foreground capitalize"
                        disabled
                      >
                        Tidak ada tipe kamar yang tersedia
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* room number */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="room_number"
                  required
                >
                  Nomor Kamar
                </Label>
                <Select
                  value={selectedRoomNumber?.id || ""}
                  onValueChange={(value) => {
                    setData("room_id", value);

                    const selectedRoom = availableRooms.find((room) => room.id === value);

                    if (selectedRoom) {
                      setSelectedRoomNumber(selectedRoom);
                      setRoomData(selectedRoom);
                    }
                  }}
                  disabled={!selectedRoomType}
                  required
                >
                  <SelectTrigger id="room_number">
                    <SelectValue>
                      <span>{selectedRoomNumber?.room_number}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {availableRooms.length > 0 ? (
                      availableRooms.map((room) => (
                        <SelectItem
                          key={room.id}
                          value={room.id}
                          className="capitalize"
                        >
                          {room.room_number}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem
                        value="no-available-room"
                        className="text-muted-foreground capitalize"
                        disabled
                      >
                        Tidak ada kamar yang tersedia
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <InputError message={errors.room_id} />
              </div>

              {/* room rate */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="room_rate"
                  required
                >
                  Harga Kamar
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    className="w-full ps-9"
                    step={25000}
                    min={100000}
                    disabled={!selectedRoomNumber}
                    value={selectedRoomNumber?.price || ""}
                    onChange={(e) => {
                      const value = Number(e.target.value);

                      if (selectedRoomNumber) {
                        setSelectedRoomNumber({
                          ...selectedRoomNumber,
                          price: value,
                        });
                      }
                    }}
                    disableHandle
                    required
                  />
                  <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-1 flex items-center px-2 text-sm select-none">
                    Rp
                  </span>
                </div>
              </div>

              {/* room package */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="room_package"
                  required
                >
                  Paket Kamar
                </Label>
                <Select
                  value={data.room_package}
                  onValueChange={(value) => {
                    setData("room_package", value as Enum.RoomPackage);
                  }}
                  disabled={!selectedRoomNumber}
                  required
                >
                  <SelectTrigger id="room_package">
                    <SelectValue>
                      <span className="capitalize">{data.room_package}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {roomPackages.map((roomPackage) => (
                      <SelectItem
                        key={roomPackage}
                        value={roomPackage}
                        className="capitalize"
                      >
                        {roomPackage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.room_package} />
              </div>

              {/* adult */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="adults"
                  required
                >
                  Dewasa
                </Label>
                <Input
                  type="number"
                  className="w-full"
                  min={1}
                  disabled={!selectedRoomNumber}
                  value={data.adults}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setData("adults", value);
                    setData("pax", value + Number(data.children));
                  }}
                  disableHandle
                  required
                />
                <InputError message={errors.adults} />
              </div>

              {/* children */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="children"
                  optional
                >
                  Anak
                </Label>
                <Input
                  type="number"
                  className="w-full"
                  min={0}
                  disabled={!selectedRoomNumber}
                  value={data.children}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setData("children", value);
                    setData("pax", Number(data.adults) + value);
                  }}
                  disableHandle
                />
                <InputError message={errors.children} />
              </div>

              {/* smoking type */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="smoking_type"
                  required
                >
                  Smoking Type
                </Label>
                <Select
                  value={data.smoking_type}
                  onValueChange={(value) => {
                    setData("smoking_type", value as Enum.SmokingType);
                  }}
                  disabled={!selectedRoomNumber}
                  required
                >
                  <SelectTrigger id="smoking_type">
                    <SelectValue>
                      <span className="capitalize">{data.smoking_type}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {smokingTypes.map((smokingType) => (
                      <SelectItem
                        key={smokingType}
                        value={smokingType}
                        className="capitalize"
                      >
                        {smokingType}
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
                    className="bg-accent ms-auto w-full"
                  >
                    <span className="text-foreground">Include Breakfast</span>
                    <span className="text-muted-foreground">{selectedRoomNumber ? `- ${selectedRoomNumber.capacity} tamu` : ""}</span>
                    <Switch
                      id="include_breakfast"
                      checked={includeBreakfast}
                      onCheckedChange={(value) => {
                        setIncludeBreakfast(value);
                        setData("include_breakfast", value);
                      }}
                      className="ms-auto"
                    />
                  </Label>
                </Button>
                <InputError message={errors.include_breakfast} />
              </div>
            </CardContent>
            <StepperNavigation
              step={step}
              setStep={setStep}
              disabledNext={
                !data.room_type_id || !data.room_id || !data.room_rate || !data.room_package || !data.pax || !data.adults || !data.smoking_type
              }
            />
          </Card>
        </TabsContent>

        <TabsContent
          id="data-tamu"
          value="3"
        >
          <Card>
            <CardHeader>
              <CardTitle>Detail Tamu</CardTitle>
            </CardHeader>
            <CardContent>
              {/* phone */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <Label
                    htmlFor="phone"
                    required
                  >
                    No. HP
                  </Label>
                  <InfoTooltip className="w-64">Isi data manual jika tamu belum tersedia.</InfoTooltip>
                </div>
                <div className="relative">
                  <Input
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData("phone", e.target.value)}
                    className="w-full pe-12 lg:pe-32"
                    inputMode="tel"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-input absolute inset-y-0 right-0 rounded-s-none border-s"
                        onClick={() => getCustomer(data.phone || "")}
                      >
                        <UserSearchIcon className="h-4 w-4" />
                        <span className="max-lg:sr-only">Cek Tamu</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Cek Ketersediaan Tamu</TooltipContent>
                  </Tooltip>
                </div>
                <InputError message={errors.phone} />
              </div>

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
                  autoComplete="off"
                  required
                />
                <InputError message={errors.name} />
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
                  inputMode="email"
                  autoComplete="off"
                  required
                />
              </div>

              {/* nik passport */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="nik_passport">NIK/Passport</Label>
                <Input
                  type="text"
                  value={data.nik_passport}
                  onChange={(e) => setData("nik_passport", e.target.value)}
                  className="w-full"
                  autoComplete="off"
                  required
                />
                <InputError message={errors.nik_passport} />
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
                    <SelectValue>
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
                  noLabel
                />
                <InputError message={errors.nationality} />
              </div>

              {/* profession */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="profession">Profesi</Label>
                <Input
                  type="text"
                  value={data.profession}
                  onChange={(e) => setData("profession", e.target.value)}
                  className="w-full"
                  autoComplete="off"
                />
                <InputError message={errors.profession} />
              </div>

              {/* country */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="country">Asal Negara</Label>
                <SelectCountry
                  label="Asal Negara"
                  data={countries}
                  value={selectedCountry}
                  setValue={({ code, name }) => {
                    setSelectedCountry(name);
                    setData((prev) => ({
                      ...prev,
                      country: name,
                      country_code: code,
                    }));
                  }}
                  noLabel
                />
                <InputError message={errors.country} />
              </div>

              {/* address */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="address">Alamat</Label>
                <Input
                  type="text"
                  value={data.address}
                  onChange={(e) => setData("address", e.target.value)}
                  className="w-full"
                  autoComplete="off"
                />
                <InputError message={errors.address} />
              </div>
            </CardContent>
            <StepperNavigation
              step={step}
              setStep={setStep}
              disabledNext={!data.phone || !data.name || !data.email || !data.birthdate || !data.gender || !data.nationality}
            />
          </Card>
        </TabsContent>

        <TabsContent
          id="pembayaran"
          value="4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              {/* discount */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="discount"
                  optional
                >
                  Discount (%)
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    className="w-full"
                    step={5}
                    min={0}
                    max={100}
                    value={data.discount}
                    onChange={(e) => setData("discount", Number(e.target.value))}
                    disableHandle
                  />
                  <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-1 flex items-center px-2 text-sm select-none">
                    %
                  </span>
                </div>
                <InputError message={errors.discount} />
              </div>

              {/* discount reason */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="discount_reason"
                  optional
                >
                  Discount Reason
                </Label>
                <Input
                  type="text"
                  value={data.discount_reason}
                  onChange={(e) => setData("discount_reason", e.target.value)}
                  className="w-full"
                />
                <InputError message={errors.discount_reason} />
              </div>

              {/* advance amount */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="advance_amount"
                  optional
                >
                  Advance Amount
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    className="w-full ps-9"
                    step={25000}
                    min={MIN_ADVANCE_AMOUNT}
                    value={data.advance_amount}
                    onChange={(e) => setData("advance_amount", Number(e.target.value))}
                    disableHandle
                    required
                  />
                  <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-1 flex items-center px-2 text-sm select-none">
                    Rp
                  </span>
                </div>
                <InputError message={errors.advance_amount} />
              </div>

              {/* advance remarks */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="advance_remarks"
                  optional
                >
                  Advance Remarks
                </Label>
                <Input
                  type="text"
                  value={data.advance_remarks}
                  onChange={(e) => setData("advance_remarks", e.target.value)}
                  className="w-full"
                />
                <InputError message={errors.advance_remarks} />
              </div>

              {/* commission percentage */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="commission_percentage"
                  optional
                >
                  Commission (%)
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    className="w-full"
                    step={5}
                    min={0}
                    max={100}
                    value={data.commission_percentage}
                    onChange={(e) => setData("commission_percentage", Number(e.target.value))}
                    disableHandle
                  />
                  <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-1 flex items-center px-2 text-sm select-none">
                    %
                  </span>
                </div>
                <InputError message={errors.commission_percentage} />
              </div>

              {/* commission amount */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="commission_amount"
                  optional
                >
                  Commission Amount
                </Label>
                <Input
                  type="number"
                  className="w-full"
                  step={25000}
                  min={0}
                  value={data.commission_amount}
                  onChange={(e) => setData("commission_amount", Number(e.target.value))}
                  disableHandle
                />
                <InputError message={errors.commission_amount} />
              </div>

              {/* payment method */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="payment_method"
                  required
                >
                  Metode Pembayaran
                </Label>
                <Select
                  value={data.payment_method}
                  onValueChange={(value) => setData("payment_method", value as Enum.Payment)}
                  required
                >
                  <SelectTrigger id="payment_method">
                    <SelectValue>
                      <span className="capitalize">{data.payment_method}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((paymentMethod) => (
                      <SelectItem
                        key={paymentMethod}
                        value={paymentMethod}
                        className="capitalize"
                      >
                        {paymentMethod}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.payment_method} />
              </div>

              {/* total price */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="total_price"
                  required
                >
                  Total Harga
                </Label>
                <Input
                  type="text"
                  className="w-full"
                  value={totalPrice}
                  readOnly
                  required
                />
                <InputError message={errors.total_price} />
              </div>
            </CardContent>
            <StepperNavigation
              step={step}
              setStep={setStep}
            >
              <Button
                size="sm"
                disabled={processing || !isDirty || !data.payment_method || !data.total_price}
                onClick={() => setSummaryDialogOpen(true)}
              >
                Cek Reservasi
              </Button>
            </StepperNavigation>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={summaryDialogOpen}
        onOpenChange={setSummaryDialogOpen}
      >
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
              <BedDoubleIcon />
              <div>
                Kamar {data.room_type_name}
                <span data-slot="separator">|</span>
                Nomor {data.room_number}
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
              <div className="capitalize">
                {data.payment_method}
                <span data-slot="separator">|</span>
                {data.discount}% diskon
              </div>
            </dd>
            <div className="end-0 top-0 flex flex-col items-end lg:absolute">
              {data.discount && (
                <div className="relative">
                  <div className="text-muted-foreground text-lg">{formatCurrency(plainPrice)}</div>
                  <span className="bg-foreground absolute start-0 top-1.5 z-10 h-px w-full origin-top-left rotate-8" />
                </div>
              )}
              <div className="text-3xl font-bold">{totalPrice}</div>
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
              disabled={processing}
              loading={processing}
              loadingText="Membuat reservasi..."
              onClick={handleCreateReservation}
              className="max-lg:order-1"
            >
              Buat Reservasi
            </SubmitButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
