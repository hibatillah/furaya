import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Tipe Kamar",
    href: route("roomtype.index"),
  },
  {
    title: "Tambah",
    href: route("roomtype.create"),
  },
];

export default function Create() {
  const { data, setData, post, errors, processing } = useForm<RoomType.Create>({
    name: "",
    capacity: "",
    base_rate: "",
  });

  function handleCreateRoomType(e: React.FormEvent) {
    e.preventDefault();

    post(route("roomtype.store"), {
      onError: () => toast.error("Tipe kamar gagal ditambahkan"),
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Tipe Kamar" />
      <h1 className="mb-6 text-2xl font-bold">Tambah Tipe Kamar</h1>
      <form
        onSubmit={handleCreateRoomType}
        className="max-w-lg space-y-6"
      >
        <div className="grid gap-2">
          <Label htmlFor="name">Nama</Label>
          <Input
            id="name"
            type="text"
            value={data.name}
            placeholder="Nama"
            onChange={(e) => setData("name", e.target.value)}
            required
          />
          <InputError message={errors.name} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="capacity">Kapasitas</Label>
          <Input
            id="capacity"
            type="number"
            value={data.capacity}
            placeholder="Kapasitas"
            onChange={(e) => setData("capacity", parseInt(e.target.value))}
            required
          />
          <InputError message={errors.capacity} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="base_rate">Tarif Dasar</Label>
          <Input
            id="base_rate"
            type="number"
            value={data.base_rate}
            placeholder="Tarif Dasar"
            onChange={(e) => setData("base_rate", parseFloat(e.target.value))}
            required
          />
          <InputError message={errors.base_rate} />
        </div>

        <Button
          type="submit"
          disabled={processing}
        >
          Tambah
        </Button>
      </form>
    </AppLayout>
  );
}
