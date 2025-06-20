import { InfoTooltip } from "@/components/info-tooltip";
import { InputDate, type InputDate as InputDateType } from "@/components/input-date";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import AppLayout from "@/layouts/app-layout";
import { formatCurrency } from "@/lib/utils";
import { MAX_LENGTH_OF_STAY, MIN_ADVANCE_AMOUNT, MIN_LENGTH_OF_STAY } from "@/static/reservation";
import { BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { addDays, addYears, format } from "date-fns";
import { Loader2, UserSearchIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function ReservationsCreate(props: {
  reservation: Reservation.Default;
  guestTypes: GuestType.Default[];
  nationalities: Nationality.Default[];
  countries: Country.Default[];
  visitPurposes: Enum.VisitPurpose[];
  bookingTypes: Enum.BookingType[];
  roomPackages: Enum.RoomPackage[];
  paymentMethods: Enum.Payment[];
  genders: Enum.Gender[];
  statusAccs: Enum.StatusAcc[];
}) {
  const { reservation, visitPurposes, bookingTypes, roomPackages, paymentMethods, genders, statusAccs, guestTypes, nationalities, countries } = props;

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

  // declare form
  const { start_date, end_date, employee, reservation_guest, reservation_room, ...initialReservationData } = reservation;

  const [birthdate, setBirthdate] = useState<InputDateType>(new Date(reservation_guest?.guest?.birthdate as string));
  const [startDate, setStartDate] = useState<InputDateType>(new Date(start_date as string));
  const [endDate, setEndDate] = useState<InputDateType>(new Date(end_date as string));
  const [selectedRoomType, setSelectedRoomType] = useState<string | undefined>(undefined);
  const [availableRoomTypes, setAvailableRoomTypes] = useState<RoomType.Default[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room.Default[]>([]);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<Room.Default | undefined>(undefined);

  const { data, setData, post, processing, errors } = useForm<Reservation.Update>({
    // reservation data
    ...initialReservationData,
    start_date,
    end_date,

    // guest data
    name: reservation_guest?.name || "",
    email: reservation_guest?.email || "",
    nik_passport: reservation_guest?.nik_passport || "",
    phone: reservation_guest?.phone || "",
    gender: reservation_guest?.guest?.gender || ("" as Enum.Gender),
    birthdate,
    profession: reservation_guest?.guest?.profession || "",
    nationality: reservation_guest?.guest?.nationality || "",
    address: reservation_guest?.guest?.address || "",
    country: reservation_guest?.guest?.country || "",

    // room data
    room_id: reservation_room?.room_id || "",
    room_number: reservation_room?.room_number || "",
    room_type: reservation_room?.room?.room_type?.id || "",
    room_rate: reservation_room?.room_rate || "",
    bed_type: reservation_room?.room?.bed_type?.id || "",
    meal: reservation_room?.room?.meal?.id || "",
    view: reservation_room?.room?.view || "",
  });

  console.log({ data });

  /**
   * Get customer data
   * apply to form based on nik_passport
   */
  const getCustomer = useCallback(
    async (value: string) => {
      try {
        toast.loading("Mencari data tamu tersedia...", { id: "get-guest" });

        const response = await fetch(`/reservasi/tamu?nik_passport=${value}`);
        const data = await response.json();
        const guest = data.guest as Guest.Default;

        if (guest) {
          toast.success("Tamu ditemukan", {
            id: "get-guest",
            description: "Data tamu diterapkan ke form",
          });

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
        toast.error("Tamu tidak ditemukan", {
          id: "get-guest",
          description: error instanceof Error ? error.message : "Terjadi kesalahan",
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

        const response = await fetch(`/reservasi/kamar/tersedia?start=${start}&end=${end}&room_type_id=${roomTypeId}`);
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
        toast.error("Gagal terhubung ke server", {
          id: "get-available-rooms",
          description: err instanceof Error ? err.message : "Terjadi kesalahan",
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

      const response = await fetch(`/reservasi/tipe-kamar/tersedia?start=${start}&end=${end}`);
      const data = await response.json();

      console.log({ data, start, end });

      if (!data.error) {
        setAvailableRoomTypes(data.roomTypes as RoomType.Default[]);
      } else {
        toast.warning("Tipe kamar tidak tersedia", {
          id: "get-available-room-types",
          description: data.error,
        });
      }
    } catch (err) {
      toast.error("Gagal terhubung ke server", {
        id: "get-available-room-types",
        description: err instanceof Error ? err.message : "Terjadi kesalahan",
      });
    }
  }, [startDate, endDate]);

  /**
   * Set room data
   * based on selected room
   */
  const setRoomData = useCallback(
    (room: Room.Default) => {
      const meal = room.meal?.name || "";

      setData((prev: Reservation.Update) => ({
        ...prev,
        room_id: room.id,
        room_number: room.room_number,
        room_type: room.room_type?.name || "",
        room_rate: room.price,
        bed_type: room.bed_type?.name || "",
        view: room.view || "",
        meal,
      }));
    },
    [selectedRoomNumber, data.room_id],
  );

  /**
   * Calculate total price
   * based on room rate, length of stay, discount percentage
   * @returns string - price in currency format
   */
  const totalPrice = useMemo(() => {
    const LoS = data.length_of_stay || 0;
    const roomRate = selectedRoomNumber?.price || 0;
    const discountPercentage = data.discount || 0;

    const priceBeforeDiscount = roomRate * LoS;
    const discount = priceBeforeDiscount * (discountPercentage / 100);
    const priceAfterDiscount = priceBeforeDiscount - discount;

    return formatCurrency(priceAfterDiscount);
  }, [selectedRoomNumber, data.length_of_stay, data.discount]);

  // handle create room
  function handleCreateRoom(e: React.FormEvent) {
    e.preventDefault();

    // sent data
    toast.loading("Menambahkan reservasi...", { id: "create-reservation" });

    post(route("reservation.store"), {
      onError: (errors) => {
        console.log(errors);
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
      getAvailableRoomTypes();
    }
  }, [startDate, endDate]);

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
            {/* start date */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="start_date">Tanggal Masuk</Label>
              <InputDate
                mode="single"
                value={startDate}
                onChange={(date) => {
                  const value = date as Date;
                  setStartDate(value);
                }}
                className="w-full"
                disabled
              />
              <InputError message={errors.start_date} />
            </div>

            {/* end date */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="end_date">Tanggal Keluar</Label>
              <InputDate
                mode="single"
                value={endDate}
                onChange={(date) => {
                  setEndDate(date);
                }}
                className="w-full"
                disabledDate={{ before: addDays(startDate as Date, 1) }}
                disabled
              />
              <InputError message={errors.end_date} />
            </div>

            {/* length of stay */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="length_of_stay">Length of Stay</Label>
              <div className="relative">
                <Input
                  type="number"
                  min={MIN_LENGTH_OF_STAY}
                  max={MAX_LENGTH_OF_STAY}
                  value={data.length_of_stay}
                  className="w-full"
                  disableHandle
                  required
                  readOnly
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
                required
              />
              <InputError message={errors.arrival_from} />
            </div>

            {/* visit purpose */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="visit_purpose">Tujuan Kedatangan</Label>
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
              <Label htmlFor="booking_type">Tipe Reservasi</Label>
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
                value={data.guest_type}
                onValueChange={(value) => setData("guest_type", value as string)}
                required
              >
                <SelectTrigger id="guest_type">
                  <SelectValue placeholder="Pilih Tipe Tamu">
                    <span className="capitalize">{guestTypes.find((type) => type.id === data.guest_type)?.name || ""}</span>
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
              <Label htmlFor="status_acc">Status Acc</Label>
              <Select
                value={data.status_acc}
                onValueChange={(value) => setData("status_acc", value as Enum.StatusAcc)}
                required
              >
                <SelectTrigger id="status_acc">
                  <SelectValue placeholder="Pilih Status Acc">
                    <span className="capitalize">{data.status_acc}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {statusAccs
                    .toSorted((a, b) => a.localeCompare(b))
                    .map((statusAcc) => (
                      <SelectItem
                        key={statusAcc}
                        value={statusAcc}
                        className="capitalize"
                      >
                        {statusAcc}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* remarks */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Input
                type="text"
                value={data.remarks}
                onChange={(e) => setData("remarks", e.target.value)}
                className="w-full"
                placeholder="Input Remarks"
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
            {/* room type */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="room_type"
                className="flex items-center gap-1"
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
                required
              >
                <SelectTrigger id="room_type">
                  <SelectValue placeholder="Pilih Tipe Kamar">
                    <span className="capitalize">{availableRoomTypes.find((type) => type.id === selectedRoomType)?.name || ""}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableRoomTypes.map((type) => (
                    <SelectItem
                      key={type.id}
                      value={type.id}
                      className="capitalize"
                      disabled={type.can_delete}
                    >
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* room number */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="room_number">Nomor Kamar</Label>
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
                  {availableRooms.map((room) => (
                    <SelectItem
                      key={room.id}
                      value={room.id}
                      className="capitalize"
                    >
                      {room.room_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.room_id} />
            </div>

            {/* room rate */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="room_rate">Harga Kamar</Label>
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
              <Label htmlFor="room_package">Paket Kamar</Label>
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
              <Label htmlFor="pax">Pax</Label>
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
              <Label htmlFor="adults">Dewasa</Label>
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
              <Label htmlFor="children">Anak</Label>
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
          </CardContent>
        </Card>

        {/* customer details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detail Customer</CardTitle>
          </CardHeader>
          <CardContent>
            {/* nik passport */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="nik_passport">NIK/Passport</Label>
              <div className="relative">
                <Input
                  type="text"
                  value={data.nik_passport}
                  onChange={(e) => setData("nik_passport", e.target.value)}
                  placeholder="Input NIK/Passport"
                  className="w-full"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="border-input absolute inset-y-0 right-0 rounded-s-none border-s"
                      onClick={() => getCustomer(data.nik_passport!)}
                    >
                      <UserSearchIcon className="h-4 w-4" />
                      <span className="sr-only">Cari Customer</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Cek Customer</TooltipContent>
                </Tooltip>
              </div>
              <p className="text-muted-foreground text-sm text-pretty">Isi data manual jika tamu belum tersedia.</p>
              <InputError message={errors.nik_passport} />
            </div>

            {/* fullname */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nama Lengkap</Label>
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
              <Label htmlFor="phone">No. HP</Label>
              <Input
                type="tel"
                value={data.phone}
                onChange={(e) => setData("phone", e.target.value)}
                className="w-full"
                placeholder="Input No. HP"
                autoComplete="off"
                required
              />
            </div>

            {/* birthdate */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="birthdate">Tanggal Lahir</Label>
              <InputDate
                mode="single"
                className="w-full"
                value={birthdate}
                onChange={(date) => setBirthdate(date as Date)}
                disabledDate={{ after: new Date() }}
                defaultMonth={addYears(new Date(), -17)}
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

            {/* email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
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

            {/* nationality */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="nationality">Kewarganegaraan</Label>
              <Select
                value={data.nationality}
                onValueChange={(value) => setData("nationality", value)}
                required
              >
                <SelectTrigger id="nationality">
                  <SelectValue placeholder="Pilih Kewarganegaraan">
                    <span className="capitalize">{nationalities.find((nationality) => nationality.id === data.nationality)?.name || ""}</span>
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

            {/* country */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="country">Negara</Label>
              <Select
                value={data.country}
                onValueChange={(value) => setData("country", value)}
                required
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Pilih Negara">
                    <span className="capitalize">{countries.find((country) => country.id === data.country)?.name || ""}</span>
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
              <Label htmlFor="discount">Discount (%)</Label>
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
              <Label htmlFor="discount_reason">Discount Reason</Label>
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
              <Label htmlFor="advance_amount">Advance Amount</Label>
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
              <Label htmlFor="advance_remarks">Advance Remarks</Label>
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
              <Label htmlFor="commission_percentage">Commission (%)</Label>
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
              <Label htmlFor="commission_amount">Commission Amount</Label>
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
              <Label htmlFor="payment_method">Metode Pembayaran</Label>
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
              <Label htmlFor="total_price">Total Harga</Label>
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
        <Button
          type="button"
          disabled={processing}
          onClick={handleCreateRoom}
          className="ms-auto w-fit"
        >
          {processing ? (
            <div className="inline-flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Membuat reservasi...
            </div>
          ) : (
            "Buat Reservasi"
          )}
        </Button>
      </form>
    </AppLayout>
  );
}
