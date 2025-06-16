import InputError from "@/components/input-error";
import Multiselect from "@/components/multiselect";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Option } from "@/components/ui/multiselect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from "@/layouts/app-layout";
import { formatCurrency } from "@/lib/utils";
import { BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Kamar",
    href: route("room.index"),
  },
  {
    title: "Tambah",
    href: route("room.create"),
  },
];

export default function RoomsCreate(props: {
  roomTypes: RoomType.Default[];
  bedTypes: BedType.Default[];
  rateTypes: RateType.Default[];
  roomConditions: Enum.RoomCondition[];
  facilities: Facility.Default[];
  roomStatuses: Enum.RoomStatus[];
  mealTypes: Meal.Default[];
}) {
  const { roomTypes, bedTypes, rateTypes, roomConditions, facilities, roomStatuses, mealTypes } = props;

  // define facility options for multiselect
  const facilityOptions = useMemo(() => {
    return facilities.map((facility) => ({
      value: facility.id,
      label: facility.name,
    }));
  }, [facilities]);

  // refine initial data
  const initialCondition = roomConditions.find((e) => e === "ready") as Enum.RoomCondition;
  const initialStatus = roomStatuses.find((e) => e === "VC") as Enum.RoomStatus;

  // declare form
  const [selectedFacilities, setSelectedFacilities] = useState<Option[]>([]);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType.Default | null>(null);
  const { data, setData, post, processing, errors } = useForm<Room.Create>({
    room_number: "",
    floor_number: "",
    view: "",
    price: "",
    capacity: "",
    condition: initialCondition,
    status: initialStatus,
    room_type_id: "",
    bed_type_id: "",
    rate_type_id: "",
    meal_id: "",
    facilities: [],
    image: null,
  });

  // handle change room type
  useEffect(() => {
    if (selectedRoomType) {
      setData("price", selectedRoomType.base_rate || "");
      setData("capacity", selectedRoomType.capacity || "");
      setSelectedFacilities(
        selectedRoomType.facility?.map((item) => ({
          value: item.id,
          label: item.name,
        })) ?? [],
      );
    }
  }, [selectedRoomType]);

  // handle create room
  function handleCreateRoom(e: React.FormEvent) {
    e.preventDefault();

    // sent data
    toast.loading("Menambahkan kamar...", { id: "create-room" });

    post(route("room.store"), {
      onError: (errors) => {
        console.log(errors);
        toast.warning("Kamar gagal ditambahkan", {
          id: "create-room",
          description: errors.message,
        });
      },
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Kamar" />
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Tambah Kamar</h1>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCreateRoom}
            className="grid gap-x-8 gap-y-6 lg:grid-cols-2 xl:grid-cols-3"
          >
            {/* room number */}
            <div className="grid gap-2">
              <Label htmlFor="room_number">Nomor Kamar</Label>
              <Input
                id="room_number"
                type="number"
                min={1}
                value={data.room_number}
                onChange={(e) => setData("room_number", parseInt(e.target.value))}
                placeholder="Nomor Kamar"
                disableHandle
                required
              />
              <InputError message={errors.room_number} />
            </div>

            {/* floor number */}
            <div className="grid gap-2">
              <Label htmlFor="floor_number">Nomor Lantai</Label>
              <Input
                id="floor_number"
                type="number"
                min={1}
                value={data.floor_number}
                onChange={(e) => setData("floor_number", parseInt(e.target.value))}
                disableHandle
                required
                placeholder="Nomor Lantai"
              />
              <InputError message={errors.floor_number} />
            </div>

            {/* room type */}
            <div className="grid gap-2">
              <Label htmlFor="room_type_id">Tipe Kamar</Label>
              <Select
                value={data.room_type_id}
                onValueChange={(value) => {
                  const roomType = roomTypes.find((type) => type.id === value);

                  setData("room_type_id", value);
                  setData("rate_type_id", roomType?.rate_type_id || "");
                  setSelectedRoomType(roomType ?? null);

                  // assign facilities
                  setData("facilities", roomType?.facility?.map((item) => item.id) ?? []);
                  setSelectedFacilities(
                    roomType?.facility?.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })) ?? [],
                  );
                }}
                disabled={roomTypes.length === 0}
              >
                <SelectTrigger id="room_type_id">
                  <SelectValue placeholder="Pilih Tipe Kamar">
                    <span className="capitalize">{roomTypes.find((type) => type.id === data.room_type_id)?.name}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((type) => (
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
              <InputError message={errors.room_type_id} />
            </div>

            {/* bed type */}
            <div className="grid gap-2">
              <Label htmlFor="bed_type_id">Tipe Kasur</Label>
              <Select
                value={data.bed_type_id}
                onValueChange={(value) => setData("bed_type_id", value)}
                disabled={bedTypes.length === 0}
              >
                <SelectTrigger id="bed_type_id">
                  <SelectValue placeholder="Pilih Tipe Kasur">
                    <span className="capitalize">{bedTypes.find((type) => type.id === data.bed_type_id)?.name}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {bedTypes.map((type) => (
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
              <InputError message={errors.bed_type_id} />
            </div>

            {/* rate type */}
            <div className="grid gap-2">
              <Label htmlFor="rate_type_id">Tipe Tarif</Label>
              <Select
                value={data.rate_type_id}
                onValueChange={(value) => {
                  setData("rate_type_id", value);
                  setData("price", rateTypes.find((type) => type.id === value)?.rate || "");
                }}
                disabled={rateTypes.length === 0}
              >
                <SelectTrigger id="rate_type_id">
                  <SelectValue placeholder="Pilih Tipe Tarif">
                    <span className="capitalize">{rateTypes.find((type) => type.id === data.rate_type_id)?.name}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {rateTypes.map((type) => (
                    <SelectItem
                      key={type.id}
                      value={type.id}
                    >
                      {type.code} - {formatCurrency(Number(type.rate))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.rate_type_id} />
            </div>

            {/* meal*/}
            <div className="grid gap-2">
              <Label htmlFor="meal_id">Tipe Makanan</Label>
              <Select
                value={data.meal_id}
                onValueChange={(value) => setData("meal_id", value)}
                disabled={mealTypes.length === 0}
              >
                <SelectTrigger id="meal_id">
                  <SelectValue placeholder="Pilih Tipe Makanan">
                    <span className="capitalize">{mealTypes.find((type) => type.id === data.meal_id)?.name}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {mealTypes.map((type) => (
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
              <InputError message={errors.meal_id} />
            </div>

            {/* price */}
            <div className="grid gap-2">
              <Label htmlFor="price">Harga</Label>
              <div className="relative">
                <Input
                  id="price"
                  type="number"
                  min={1}
                  step="any"
                  value={data.price}
                  onChange={(e) => setData("price", parseInt(e.target.value))}
                  className="ps-8"
                  placeholder="Harga"
                  disableHandle
                  required
                />
                <span className="text-muted-foreground absolute inset-y-0 start-2 flex items-center text-sm">Rp</span>
              </div>
              <InputError message={errors.price} />
            </div>

            {/* condition */}
            <div className="grid gap-2">
              <Label htmlFor="condition">Kondisi</Label>
              <Select
                value={data.condition}
                onValueChange={(value) => setData("condition", value as Enum.RoomCondition)}
              >
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Pilih Kondisi">
                    <span className="capitalize">{data.condition}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {roomConditions.map((condition) => (
                    <SelectItem
                      key={condition}
                      value={condition}
                      className="capitalize"
                    >
                      {condition}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.condition} />
            </div>

            {/* capacity */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="capacity">Kapasitas</Label>
              <div className="relative">
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  value={data.capacity}
                  onChange={(e) => setData("capacity", parseInt(e.target.value))}
                  disableHandle
                  required
                  placeholder="Kapasitas"
                />
                <span className="text-muted-foreground absolute inset-y-0 end-3 flex items-center text-sm">Orang</span>
              </div>
              <InputError message={errors.capacity} />
            </div>

            {/* status */}
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={data.status}
                onValueChange={(value) => setData("status", value as Enum.RoomStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Pilih Status">
                    <span className="uppercase">{data.status}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {roomStatuses.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="uppercase"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.condition} />
            </div>

            {/* view */}
            <div className="grid gap-2">
              <Label htmlFor="view">View</Label>
              <Input
                id="view"
                type="text"
                value={data.view}
                placeholder="View"
                onChange={(e) => setData("view", e.target.value)}
                disableHandle
              />
              <InputError message={errors.view} />
            </div>

            {/* image */}
            <div className="grid gap-2">
              <Label htmlFor="image">Gambar</Label>
              <Input
                id="image"
                type="file"
                placeholder="Gambar"
                accept="image/*"
                onChange={(e) => setData("image", e.target.files?.[0] ?? null)}
              />
              <InputError message={errors.image} />
            </div>

            {/* facilities */}
            <div className="grid gap-2">
              <Label htmlFor="facilities">Fasilitas</Label>
              <Multiselect
                label="Fasilitas"
                data={facilityOptions}
                value={selectedFacilities}
                onChange={(value) => {
                  setSelectedFacilities(value);
                  setData(
                    "facilities",
                    value.map((item) => item.value),
                  );
                }}
              />
              <InputError message={errors.facilities} />
            </div>

            {/* submit */}
            <SubmitButton
              disabled={processing}
              loading={processing}
              loadingText="Menyimpan..."
              className="w-full lg:col-span-full lg:w-fit lg:place-self-end"
            >
              Simpan
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
