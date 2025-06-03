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
import { useMemo, useState } from "react";
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
  statusOptions: Enum.RoomStatus[];
  roomConditions: Enum.RoomCondition[];
  facilities: Facility.Default[];
}) {
  const { roomTypes, bedTypes, statusOptions, roomConditions, facilities } = props;

  const [selectedFacilities, setSelectedFacilities] = useState<Option[]>([]);

  // define facility options for multiselect
  const facilityOptions = useMemo(() => {
    return facilities.map((facility) => ({
      value: facility.id,
      label: facility.name,
    }));
  }, [facilities]);

  // refine initial data
  const initialCondition = roomConditions.find((e) => e === "ready") as Enum.RoomCondition;

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
  });

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

            <div className="grid gap-2">
              <Label htmlFor="room_type_id">Tipe Kamar</Label>
              <Select
                value={data.room_type_id}
                onValueChange={(value) => setData("room_type_id", value)}
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
