import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { toast } from "sonner";
export default function Edit(props: { roomType: RoomType.Default }) {
  const { roomType } = props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Tipe Kamar",
      href: route("roomtype.index"),
    },
    {
      title: "Edit",
      href: route("roomtype.edit", { id: roomType.id }),
    },
  ];

  const { data, setData, put, processing, errors } = useForm<RoomType.Update>(roomType);

  function handleUpdateRoomType(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Memperbarui tipe kamar...", { id: "update-room-type" });
    put(route("roomtype.update", { id: data.id }), {
      onError: () => toast.error("Tipe kamar gagal diperbarui", { id: "update-room-type" }),
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Tipe Kamar" />
      <h1 className="mb-6 text-2xl font-bold">Edit Tipe Kamar</h1>
      <form
        onSubmit={handleUpdateRoomType}
        className="max-w-lg space-y-6"
      >
        <div className="grid gap-2">
          <Label htmlFor="name">Nama</Label>
          <Input
            id="name"
            type="text"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            required
            placeholder="Nama"
          />
          <InputError message={errors.name} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="capacity">Kapasitas</Label>
          <Input
            id="capacity"
            type="number"
            value={data.capacity}
            onChange={(e) => setData("capacity", parseInt(e.target.value))}
            required
            placeholder="Kapasitas"
          />
          <InputError message={errors.capacity} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="base_rate">Tarif Dasar</Label>
          <Input
            id="base_rate"
            type="number"
            value={data.base_rate}
            onChange={(e) => setData("base_rate", parseFloat(e.target.value))}
            required
            placeholder="Tarif Dasar"
          />
          <InputError message={errors.base_rate} />
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
