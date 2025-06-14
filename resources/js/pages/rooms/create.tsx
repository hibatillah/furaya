import InputError from "@/components/input-error";
import Multiselect from "@/components/multiselect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Option } from "@/components/ui/multiselect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { Loader2 } from "lucide-react";
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
  roomConditions: Enum.RoomCondition[];
  facilities: Facility.Default[];
}) {
  const { roomTypes, bedTypes, roomConditions, facilities } = props;

  // define facility options for multiselect
  const facilityOptions = useMemo(() => {
    return facilities.map((facility) => ({
      value: facility.id,
      label: facility.name,
    }));
  }, [facilities]);

  // refine initial data
  const initialCondition = roomConditions.find((e) => e === "ready") as Enum.RoomCondition;

  // declare form
  const [selectedFacilities, setSelectedFacilities] = useState<Option[]>([]);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType.Default | null>(null);
  const { data, setData, post, processing, errors } = useForm<Room.Create>({
    room_number: "",
    floor_number: "",
    view: "",
    condition: initialCondition,
    price: "",
    capacity: "",
    room_type_id: "",
    bed_type_id: "",
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
            className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2"
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
                required
                placeholder="Nomor Kamar"
              />
              <InputError message={errors.room_number} />
            </div>

            {/* room type */}
            <div className="grid gap-2">
              <Label htmlFor="room_type_id">Tipe Kamar</Label>
              <Select
                value={data.room_type_id}
                onValueChange={(value) => {
                  setData("room_type_id", value);
                  setSelectedRoomType(roomTypes.find((type) => type.id === value) ?? null);
                }}
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

            {/* floor number */}
            <div className="grid gap-2">
              <Label htmlFor="floor_number">Nomor Lantai</Label>
              <Input
                id="floor_number"
                type="number"
                min={1}
                value={data.floor_number}
                onChange={(e) => setData("floor_number", parseInt(e.target.value))}
                required
                placeholder="Nomor Lantai"
              />
              <InputError message={errors.floor_number} />
            </div>

            {/* bed type */}
            <div className="grid gap-2">
              <Label htmlFor="bed_type_id">Tipe Bed</Label>
              <Select
                value={data.bed_type_id}
                onValueChange={(value) => setData("bed_type_id", value)}
              >
                <SelectTrigger id="bed_type_id">
                  <SelectValue placeholder="Pilih Tipe Bed">
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

            {/* price */}
            <div className="grid gap-2">
              <Label htmlFor="price">Harga</Label>
              <Input
                id="price"
                type="number"
                min={1}
                value={data.price}
                onChange={(e) => setData("price", parseInt(e.target.value))}
                required
                placeholder="Harga"
              />
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
              <Input
                id="capacity"
                type="number"
                min={1}
                value={data.capacity}
                onChange={(e) => setData("capacity", parseInt(e.target.value))}
                required
                placeholder="Kapasitas"
              />
              <InputError message={errors.capacity} />
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
                required
              />
              <InputError message={errors.view} />
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

            {/* image */}
            <div className="grid gap-2">
              <Label htmlFor="image">Gambar</Label>
              <Input
                id="image"
                type="file"
                placeholder="Gambar"
                accept="image/*"
                onChange={(e) => setData("image", e.target.files?.[0] ?? null)}
                required
              />
              <InputError message={errors.image} />
            </div>

            {/* submit */}
            <Button
              type="submit"
              disabled={processing}
              className="col-start-2 w-fit place-self-end"
            >
              {processing ? (
                <div className="inline-flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </div>
              ) : (
                "Simpan"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
