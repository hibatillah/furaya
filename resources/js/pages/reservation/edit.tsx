import { DataList } from "@/components/data-list";
import { InfoTooltip } from "@/components/info-tooltip";
import { InputDate, type InputDate as InputDateType } from "@/components/input-date";
import InputError from "@/components/input-error";
import { SubmitButton } from "@/components/submit-button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import AppLayout from "@/layouts/app-layout";
import { cn, formatCurrency } from "@/lib/utils";
import {
  BASE_BREAKFAST_RATE,
  MAX_LENGTH_OF_STAY,
  MIN_ADVANCE_AMOUNT,
  MIN_LENGTH_OF_STAY,
  MIN_PAX,
  reservationStatusBadgeColor,
  transactionStatusBadgeColor,
} from "@/static/reservation";
import { BreadcrumbItem, SharedData } from "@/types";
import { Head, useForm, usePage } from "@inertiajs/react";
import { addDays, addYears, differenceInCalendarDays, format, isAfter, isSameDay } from "date-fns";
import { UserSearchIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function ReservationsEdit(props: {
  reservation: Reservation.Default;
  guestTypes: GuestType.Default[];
  nationalities: Nationality.Default[];
  countries: Country.Default[];
  visitPurposes: Enum.VisitPurpose[];
  bookingTypes: Enum.BookingType[];
  roomPackages: Enum.RoomPackage[];
  paymentMethods: Enum.Payment[];
  genders: Enum.Gender[];
  roomTypes: RoomType.Default[];
  statusAcc: Enum.StatusAcc[];
}) {
  const {
    visitPurposes,
    bookingTypes,
    roomPackages,
    paymentMethods,
    genders,
    reservation,
    statusAcc,
    guestTypes,
    nationalities,
    countries,
    roomTypes,
  } = props;

  const { auth } = usePage<SharedData>().props;
  const employeeName = auth.user.name;

  // define breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Reservasi",
      href: route("reservation.index"),
    },
    {
      title: "Edit",
      href: route("reservation.edit", { id: reservation.id }),
    },
  ];

  // declare initial data
  const initialStartDate = new Date();
  const initialEndDate = addDays(initialStartDate, 1);
  const initialBirthdateYear = addYears(initialStartDate, -17); // Customer must be at least 17 years old

  const { start_date, end_date, reservation_guest, reservation_room, ...reservationData } = reservation;
  const isPendingReservation = reservationData.status_acc === "pending" && !reservation_room?.room_id;

  const initialGuestType = guestTypes.find((e) => e.name === reservation.guest_type);
  const initialNationality = nationalities.find((e) => e.name === reservation_guest?.nationality);
  const initialCountry = countries.find((e) => e.name === reservation_guest?.country);

  // handle form state
  const [startDate, setStartDate] = useState<InputDateType>(new Date(start_date) || initialStartDate);
  const [endDate, setEndDate] = useState<InputDateType>(new Date(end_date as string) || initialEndDate);
  const [selectedRoomType, setSelectedRoomType] = useState<string | undefined>(reservation_room?.room_type_id);
  const [availableRoomTypes, setAvailableRoomTypes] = useState<RoomType.Default[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room.Default[]>([]);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<Room.Default | undefined>(reservation_room?.room);
  const [selectedGuestType, setSelectedGuestType] = useState<string | undefined>(initialGuestType?.id);
  const [selectedNationality, setSelectedNationality] = useState<string | undefined>(initialNationality?.id);
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(initialCountry?.id);
  const [includeBreakfast, setIncludeBreakfast] = useState<boolean>(reservationData.include_breakfast || true);

  // define form
  const { data, setData, put, processing, errors } = useForm<Reservation.Update>({
    // reservation data
    id: reservation.id,
    booking_number: reservationData.booking_number,
    start_date: startDate as Date,
    end_date: endDate as Date,
    length_of_stay: reservationData.length_of_stay,
    adults: reservationData.adults || 1,
    status: "booked" as Enum.ReservationStatus,
    pax: reservationData.pax || MIN_PAX,
    total_price: reservationData.total_price || 0,
    children: reservationData.children || 0,
    arrival_from: reservationData.arrival_from || "",
    guest_type: reservationData.guest_type || "",
    employee_name: reservationData.employee_name || employeeName,
    employee_id: reservationData.employee_id,
    booking_type: reservationData.booking_type,
    visit_purpose: reservationData.visit_purpose,
    room_package: reservationData.room_package,
    payment_method: reservationData.payment_method,
    status_acc: reservationData.status_acc,
    discount: reservationData.discount || "",
    discount_reason: reservationData.discount_reason || "",
    commission_percentage: reservationData.commission_percentage || "",
    commission_amount: reservationData.commission_amount || "",
    remarks: reservationData.remarks || "",
    advance_remarks: reservationData.advance_remarks || "",
    advance_amount: reservationData.advance_amount || MIN_ADVANCE_AMOUNT,
    smoking_type: reservationData.smoking_type || ("" as Enum.SmokingType),
    include_breakfast: reservationData.include_breakfast || includeBreakfast,

    // guest data
    name: reservation_guest?.name || "",
    email: reservation_guest?.guest?.user?.email || "",
    nik_passport: reservation_guest?.nik_passport || "",
    phone: reservation_guest?.phone || "",
    gender: reservation_guest?.guest?.gender,
    birthdate: reservation_guest?.guest?.gender ? new Date(reservation_guest?.guest?.birthdate as string) : "",
    profession: reservation_guest?.guest?.profession || "",
    nationality: reservation_guest?.guest?.nationality || "",
    address: reservation_guest?.guest?.address || "",
    country: reservation_guest?.guest?.country || "",

    // room data
    room_id: reservation_room?.room_id || "",
    room_number: reservation_room?.room_number || "",
    room_type_id: reservation_room?.room_type_id || "",
    room_type_name: reservation_room?.room_type_name || "",
    room_rate: reservation_room?.room_rate || "",
    bed_type: reservation_room?.bed_type || "",
    view: reservation_room?.room?.view || "",
  });

  /**
   * Get customer data
   * apply to form based on nik_passport
   */
  const getCustomer = useCallback(
    async (value: string) => {
      try {
        toast.loading("Mencari data tamu tersedia...", { id: "get-guest" });

        const response = await fetch(`/admin/reservasi/tamu?nik_passport=${value}`);
        const data = await response.json();
        const guest = data.guest as Guest.Default;

        if (guest) {
          toast.success("Tamu ditemukan", {
            id: "get-guest",
            description: "Data tamu diterapkan ke form",
          });

          const nationality = nationalities.find((e) => e.name === guest.nationality);
          const country = countries.find((e) => e.name === guest.country);

          setSelectedNationality(nationality?.id);
          setSelectedCountry(country?.id);

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
            address: guest.address || "",
            country: guest.country || "",
          }));
        } else {
          toast.warning("Tamu tidak ditemukan", {
            id: "get-guest",
            description: "Buat data tamu baru",
          });
        }
      } catch (error) {
        toast.error("Terjadi Kesalahan", {
          id: "get-guest",
          description: "Tamu tidak ditemukan",
        });
      }
    },
    [data.nik_passport],
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
      setData((prev: Reservation.Update) => ({
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
    const roomRate = data.room_rate || 0;
    const breakfastRate = data.include_breakfast ? BASE_BREAKFAST_RATE * (selectedRoomNumber?.capacity || 0) * LoS : 0;

    return breakfastRate;
  }, [selectedRoomNumber, data.length_of_stay, data.include_breakfast]);

  /**
   * Calculate total price
   * based on room rate, length of stay, discount percentage
   * @returns string - price in currency format
   */
  const totalPrice = useMemo(() => {
    // set initial total price
    if (isPendingReservation && !selectedRoomNumber) {
      return formatCurrency(reservationData.total_price || 0);
    }

    // calculate total price
    const LoS = data.length_of_stay || 1;
    const roomRate = data.room_rate || 0;
    const discountPercentage = data.discount || 0;

    const priceBeforeDiscount = roomRate * LoS + breakfastRate;
    const discount = priceBeforeDiscount * (discountPercentage / 100);
    const priceAfterDiscount = priceBeforeDiscount - discount;

    setData("total_price", priceAfterDiscount);
    return formatCurrency(priceAfterDiscount);
  }, [selectedRoomNumber, data.length_of_stay, data.discount, data.include_breakfast]);

  // handle update reservation
  function handleUpdateReservation(e: React.FormEvent) {
    e.preventDefault();

    // sent data
    toast.loading("Memperbarui reservasi...", { id: "update-reservation" });

    put(route("reservation.update", { id: reservation.id }), {
      onError: () => {
        toast.warning("Reservasi gagal diperbarui", {
          id: "update-reservation",
          description: "Terjadi kesalahan saat memperbarui reservasi",
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
      getAvailableRooms(selectedRoomType as string);
    }
  }, [startDate, endDate]);

  // detail reservation
  const detailReservation = useMemo(() => {
    return [
      {
        label: "Booking Number",
        value: reservation.booking_number,
      },
      {
        label: "Dibuat Oleh",
        value: reservation.employee_name,
      },
      {
        label: "Status",
        value: (
          <Badge
            variant="outline"
            className={cn("capitalize", reservationStatusBadgeColor[reservation.status])}
          >
            {reservation.status}
          </Badge>
        ),
      },
      {
        label: "Status Pembayaran",
        value: (
          <Badge
            variant="outline"
            className={cn("capitalize", transactionStatusBadgeColor[reservation.transaction_status ?? ""])}
          >
            {reservation.transaction_status}
          </Badge>
        ),
      },
      {
        label: "Metode Pembayaran",
        value: reservation.payment_type ? (
          <Badge
            variant="outline"
            className="capitalize"
          >
            {reservation.payment_type}
          </Badge>
        ) : (
          "-"
        ),
      },
      {
        label: "Bank Pembayaran",
        value: reservation.transaction_bank ?? "-",
      },
      {
        label: "Check In",
        value: reservation.formatted_check_in_at ?? "-",
      },
      {
        label: "Check In Oleh",
        value: reservation.check_in?.check_in_by ?? "-",
      },
      {
        label: "Check Out",
        value: reservation.formatted_check_out_at ?? "-",
      },
      {
        label: "Check Out Oleh",
        value: reservation.check_out?.check_out_by ?? "-",
      },
    ];
  }, [reservation]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Reservasi" />
      <h1 className="text-2xl font-bold">Edit Reservasi</h1>
      <form className="flex flex-col gap-6 *:data-[slot=card]:gap-4 **:data-[slot=card-content]:grid **:data-[slot=card-content]:gap-5 **:data-[slot=card-content]:lg:grid-cols-2 **:data-[slot=card-content]:xl:grid-cols-4">
        {/* reservation details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detail Reservasi</CardTitle>
          </CardHeader>
          <CardContent>
            <DataList
              data={detailReservation}
              className="col-span-full [--columns:2]"
            />
          </CardContent>
        </Card>

        {/* booking details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detail Booking</CardTitle>
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

                    // reset selected room
                    setSelectedRoomType(undefined);
                    setSelectedRoomNumber(undefined);
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
                  const value = date as Date;
                  setEndDate(date);
                  setData("end_date", value.toISOString());

                  // handle length of stay
                  if (date && startDate) {
                    const diffDays = differenceInCalendarDays(value, startDate as Date);

                    // reset selected room
                    setSelectedRoomType(undefined);
                    setSelectedRoomNumber(undefined);
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

                      // reset selected room
                      setSelectedRoomType(undefined);
                      setSelectedRoomNumber(undefined);
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
                placeholder="Input Asal Kedatangan"
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
                  <SelectValue placeholder="Pilih Tujuan Kedatangan">
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
                  <SelectValue placeholder="Pilih Tipe Reservasi">
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
              <Label htmlFor="guest_type">Tipe Tamu</Label>
              <Select
                value={selectedGuestType}
                onValueChange={(value) => {
                  setSelectedGuestType(value);
                  setData("guest_type", guestTypes.find((type) => type.id === value)?.name || "");
                }}
                required
              >
                <SelectTrigger id="guest_type">
                  <SelectValue placeholder="Pilih Tipe Tamu">
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

            {/* status acc */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="status_acc"
                required
              >
                Status Acc
              </Label>
              <Select
                value={data.status_acc}
                onValueChange={(value) => {
                  setData("status_acc", value as Enum.StatusAcc);
                }}
                required
              >
                <SelectTrigger id="status_acc">
                  <SelectValue placeholder="Pilih Status Acc">
                    <span className="capitalize">{data.status_acc}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {statusAcc.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="capitalize"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.status_acc} />
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
                placeholder="Input Remarks"
                autoComplete="off"
              />
              <InputError message={errors.remarks} />
            </div>
          </CardContent>
        </Card>

        {/* room details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detail Kamar</CardTitle>
          </CardHeader>
          <CardContent>
            {isPendingReservation && (
              <Alert
                className="col-span-full"
                variant="primary"
              >
                <AlertTitle>Konfirmasi reservasi dengan menentukan nomor kamar sesuai tipe kamar yang telah dipesan.</AlertTitle>
              </Alert>
            )}

            {/* room type */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="room_type"
                className="flex items-center gap-1"
                required
              >
                <span>Tipe Kamar</span>
                <InfoTooltip>Opsi hanya menampilkan tipe kamar yang tersedia sesuai tanggal reservasi.</InfoTooltip>
              </Label>
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
                disabled={isPendingReservation}
                required
              >
                <SelectTrigger id="room_type">
                  <SelectValue placeholder="Pilih Tipe Kamar">
                    <span className="capitalize">{roomTypes.find((type) => type.id === selectedRoomType)?.name || ""}</span>
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
                  <SelectValue placeholder="Pilih Nomor Kamar">
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
                  placeholder="Input Harga Kamar"
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
                  <SelectValue placeholder="Pilih Paket Kamar">
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

            {/* pax */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="pax"
                required
              >
                Pax
              </Label>
              <Input
                type="number"
                className="w-full"
                min={1}
                placeholder="Input Jumlah Pax"
                value={data.pax}
                disableHandle
                required
                readOnly
              />
              <InputError message={errors.pax} />
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
                placeholder="Input Jumlah Dewasa"
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
                placeholder="Input Jumlah Anak"
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
                  <span>Include Breakfast</span>
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
        </Card>

        {/* customer details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detail Customer</CardTitle>
          </CardHeader>
          <CardContent>
            {/* phone */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="phone"
                required
              >
                No. HP
              </Label>
              <div className="relative">
                <Input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => setData("phone", e.target.value)}
                  placeholder="Input No. HP"
                  className="w-full"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="border-input absolute inset-y-0 right-0 rounded-s-none border-s"
                      onClick={() => getCustomer(data.phone || "")}
                    >
                      <UserSearchIcon className="h-4 w-4" />
                      <span className="sr-only">Cari Customer</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Cek Customer</TooltipContent>
                </Tooltip>
              </div>
              <p className="text-muted-foreground text-sm text-pretty">Isi data manual jika tamu belum tersedia.</p>
              <InputError message={errors.phone} />
            </div>

            {/* name */}
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
              />
              <InputError message={errors.email} />
            </div>

            {/* nik passport */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="nik_passport">NIK/Passport</Label>
              <Input
                type="text"
                value={data.nik_passport}
                onChange={(e) => setData("nik_passport", e.target.value)}
                className="w-full"
                placeholder="Input NIK/Passport"
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
              <Label htmlFor="gender">Jenis Kelamin</Label>
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
                    <span className="capitalize">{nationalities.find((nationality) => nationality.id === selectedNationality)?.name}</span>
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

            {/* profession */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="profession">Profesi</Label>
              <Input
                type="text"
                value={data.profession}
                onChange={(e) => setData("profession", e.target.value)}
                className="w-full"
                placeholder="Input Profesi"
                autoComplete="off"
              />
              <InputError message={errors.profession} />
            </div>

            {/* country */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="country">Negara</Label>
              <Select
                value={selectedCountry}
                onValueChange={(value) => {
                  setSelectedCountry(value);
                  setData("country", countries.find((country) => country.id === value)?.name || "");
                }}
                required
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Pilih Negara">
                    <span className="capitalize">{countries.find((country) => country.id === selectedCountry)?.name}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem
                      key={country.id}
                      value={country.id}
                      className="capitalize"
                    >
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                placeholder="Input Alamat"
                autoComplete="off"
              />
              <InputError message={errors.address} />
            </div>
          </CardContent>
        </Card>

        {/* payment details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detail Pembayaran</CardTitle>
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
                  placeholder="Input Discount (%)"
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
                placeholder="Input Discount Reason"
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
                  placeholder="Input Advance Amount"
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
                placeholder="Input Advance Remarks"
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
                  placeholder="Input Commission (%)"
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
                placeholder="Input Commission Amount"
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
                  <SelectValue placeholder="Pilih Metode Pembayaran">
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
                placeholder="Input Total Harga"
                value={totalPrice}
                readOnly
                required
              />
              <InputError message={errors.total_price} />
            </div>
          </CardContent>
        </Card>

        {/* submit */}
        <SubmitButton
          disabled={processing}
          loading={processing}
          loadingText="Memperbarui reservasi..."
          onClick={handleUpdateReservation}
          className="ms-auto w-fit"
        >
          Perbarui Reservasi
        </SubmitButton>
      </form>
    </AppLayout>
  );
}
