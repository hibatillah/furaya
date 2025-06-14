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
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

export default function RoomsEdit(props: {
  room: Room.Default;
  roomTypes: RoomType.Default[];
  bedTypes: BedType.Default[];
  roomConditions: Enum.RoomCondition[];
  facilities: Facility.Default[];
}) {
  const { room, roomTypes, bedTypes, roomConditions, facilities } = props;
  const { room_type, bed_type, room_status, facility: roomFacility, ...rest } = room;

  // define breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Kamar",
      href: route("room.index"),
    },
    {
      title: "Edit",
      href: route("room.edit", { id: room.id }),
    },
  ];

  // define facility options for multiselect form
  const facilityOptions = useMemo(() => {
    return facilities.map((facility) => ({
      value: facility.id,
      label: facility.name,
    }));
  }, [facilities]);

  // declare form
  const initialFacilities = useMemo(() => {
    if (roomFacility && roomFacility.length > 0) {
      return roomFacility.map((item) => ({
        value: item.facility?.id ?? "",
        label: item.facility?.name ?? "",
      }));
    }
    return [];
  }, [roomFacility]);

  const [selectedFacilities, setSelectedFacilities] = useState<Option[]>(initialFacilities);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType.Default | null>(room_type ?? null);
  const isFirstRender = useRef(true);

  const { data, setData, post, processing, errors } = useForm<Room.Update>({
    ...rest,
    facilities: initialFacilities.map((item) => item.value),
  });

  // handle change room type
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

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

  // handle update room
  function handleUpdateRoom(e: React.FormEvent) {
    e.preventDefault();

    // sent data
    toast.loading("Mengubah kamar...", { id: "update-room" });

    post(route("room.update", { id: room.id }), {
      onError: (errors) => {
        console.log(errors);
        toast.warning("Kamar gagal diubah", {
          id: "update-room",
          description: errors.message,
        });
      },
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Kamar" />
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Edit Kamar</h1>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleUpdateRoom}
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

            {/* submit button */}
            <Button
              type="submit"
              disabled={processing}
              className="col-span-2 col-start-1 w-fit place-self-end"
            >
              {processing ? (
                <div className="inline-flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan perubahan...
                </div>
              ) : (
                "Simpan perubahan"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
