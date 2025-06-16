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
import { MAX_LENGTH_OF_STAY, MIN_ADVANCE_AMOUNT, MIN_LENGTH_OF_STAY, MIN_PAX } from "@/static/reservation";
import { BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { addDays, addYears, differenceInCalendarDays, format, isAfter, isSameDay } from "date-fns";
import { Loader2, UserSearchIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Reservasi",
    href: route("reservation.index"),
  },
  {
    title: "Tambah",
    href: route("reservation.create"),
  },
];

export default function ReservationsCreate(props: {
  rooms: Room.Default[];
  visitPurposes: Enum.VisitPurpose[];
  bookingTypes: Enum.BookingType[];
  roomPackages: Enum.RoomPackage[];
  roomTypes: RoomType.Default[];
  paymentMethods: Enum.Payment[];
  genders: Enum.Gender[];
  statusAccs: Enum.StatusAcc[];
  employeeId: string;
}) {
  const { visitPurposes, bookingTypes, roomPackages, roomTypes, paymentMethods, genders, statusAccs, employeeId } = props;

  // declare form
  const initialStartDate = new Date();
  const initialEndDate = addDays(initialStartDate, 1);
  const initialBirthdateYear = addYears(initialStartDate, -17); // Customer must be at least 17 years old

  const [startDate, setStartDate] = useState<InputDateType>(initialStartDate);
  const [endDate, setEndDate] = useState<InputDateType>(initialEndDate);
  const [selectedRoomType, setSelectedRoomType] = useState<string | undefined>(undefined);
  const [availableRooms, setAvailableRooms] = useState<Room.Default[]>([]);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<Room.Default | undefined>(undefined);

  const { data, setData, post, processing, errors } = useForm<Reservation.Create>({
    booking_number: 0,
    length_of_stay: MIN_LENGTH_OF_STAY,
    adults: 1,
    children: 0,
    pax: MIN_PAX,
    total_price: 0,
    start_date: startDate as Date,
    end_date: endDate as Date,
    room_id: "",
    customer_id: "",
    employee_id: employeeId,
    booking_type: "" as Enum.BookingType,
    purpose: "" as Enum.VisitPurpose,
    room_package: "" as Enum.RoomPackage,
    payment_method: "" as Enum.Payment,
    status_acc: "" as Enum.StatusAcc,
    arrival_from: "",
    booked_from: "",
    extra_bed: 0,
    discount: "",
    discount_reason: "",
    commission_percentage: "",
    commission_amount: "",
    remarks: "",
    advance_remarks: "",
    advance_amount: MIN_ADVANCE_AMOUNT,
    nik_passport: "",
    name: "",
    email: "",
    gender: "" as Enum.Gender,
    birthdate: "",
    phone: "",
    profession: "",
    nationality: "",
    address: "",
  });

  /**
   * Get customer data
   * apply to form based on nik_passport
   */
  const getCustomer = useCallback(
    async (value: string) => {
      try {
        toast.loading("Mencari tamu...", { id: "get-guest" });

        const response = await fetch(`/reservasi/guest?nik_passport=${value}`);
        const data = await response.json();
        const customer = data.customer as Guest.Default;

        if (customer) {
          toast.success("Customer ditemukan", {
            id: "get-customer",
            description: "Data customer diterapkan ke form",
          });

          // apply customer data to form
          setData((prev) => ({
            ...prev,
            name: customer.user?.name || "",
            email: customer.user?.email || "",
            phone: customer.phone || "",
            gender: customer.gender || "",
            birthdate: new Date(customer.birthdate) || "",
            profession: customer.profession || "",
            nationality: customer.nationality || "",
            address: customer.address || "",
          }));
        }
      } catch (error) {
        console.error(error);

        toast.error("Customer tidak ditemukan", {
          id: "get-customer",
          description: "Customer belum terdaftar",
        });
      }
    },
    [data.nik_passport],
  );

  /**
   * Get available rooms
   * based on room type, start date, end date
   */
  const getAvailableRooms = useCallback(async () => {
    try {
      const start = format(startDate as Date, "yyyy-MM-dd");
      const end = format(endDate as Date, "yyyy-MM-dd");

      const response = await fetch(`/reservasi/kamar/tersedia?start=${start}&end=${end}`);
      const data = await response.json();

      const rooms = data.rooms as Room.Default[];
      setAvailableRooms(rooms);
    } catch (err) {
      console.error("Fetch failed:", err);
      toast.error("Gagal terhubung ke server");
    }
  }, [startDate, endDate]);


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
    console.log(data);
    return;

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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Reservasi" />
      <h1 className="text-2xl font-bold">Tambah Reservasi</h1>
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
              <Label htmlFor="end_date">Tanggal Keluar</Label>
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
              <Label htmlFor="length_of_stay">Length of Stay</Label>
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
                placeholder="Input Asal Kedatangan"
                required
              />
              <InputError message={errors.arrival_from} />
            </div>

            {/* visit purpose */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="visit_purpose">Tujuan Kedatangan</Label>
              <Select
                value={data.purpose}
                onValueChange={(value) => setData("purpose", value as Enum.VisitPurpose)}
                required
              >
                <SelectTrigger id="purpose">
                  <SelectValue placeholder="Pilih Tujuan Kedatangan">
                    <span className="capitalize">{data.purpose}</span>
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
              <InputError message={errors.purpose} />
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
                  {statusAccs.map((statusAcc) => (
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
              <Label htmlFor="room_type">Tipe Kamar</Label>
              <Select
                value={selectedRoomType}
                onValueChange={(value) => {
                  setSelectedRoomType(value);
                  setSelectedRoomNumber(undefined);
                  getAvailableRooms();
                }}
                required
              >
                <SelectTrigger id="room_type">
                  <SelectValue placeholder="Pilih Tipe Kamar" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((type) => (
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
                  setSelectedRoomNumber(availableRooms.find((room) => room.id === value) ?? undefined);
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
                  {availableRooms.length > 0 &&
                    availableRooms
                      .filter((room) => room.room_type_id === selectedRoomType)
                      .map((room) => (
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
                      onClick={() => getCustomer(data.nik_passport)}
                    >
                      <UserSearchIcon className="h-4 w-4" />
                      <span className="sr-only">Cari Customer</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Cek Customer</TooltipContent>
                </Tooltip>
              </div>
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
              <Input
                type="text"
                value={data.nationality}
                onChange={(e) => setData("nationality", e.target.value)}
                className="w-full"
                placeholder="Input Kewarganegaraan"
                autoComplete="off"
              />
              <InputError message={errors.nationality} />
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
