import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function RoomsEdit(props: {
  room: Room.Default;
  roomTypes: RoomType.Default[];
  bedTypes: BedType.Default[];
  statusOptions: Enum.RoomStatus[];
}) {
  const { room, roomTypes, bedTypes, statusOptions } = props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Kamar",
      href: "/kamar",
    },
    {
      title: "Edit",
      href: `/kamar/${room.id}/edit`,
    },
  ];

  const { data, setData, put, processing, errors } = useForm<Room.Update>(room);

  function handleCreateRoom(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Memperbarui kamar...", { id: "update-room" });
    put(route("room.update", { id: data.id }), {
      onError: () => toast.error("Kamar gagal diperbarui", { id: "update-room" }),
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Kamar" />
      <h1 className="mb-6 text-2xl font-bold">Tambah Kamar</h1>
      <form
        onSubmit={handleCreateRoom}
        className="max-w-lg space-y-6"
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
          <Label htmlFor="status">Status</Label>
          <Select
            value={data.status}
            onValueChange={(value) => setData("status", value as Enum.RoomStatus)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Pilih Status">
                <span className="capitalize">{data.status}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
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
          <InputError message={errors.status} />
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

        <Button
          type="submit"
          disabled={processing}
        >
          Simpan
        </Button>
      </form>
    </AppLayout>
  );
}
