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
    title: "Tipe Kasur",
    href: route("bedtype.index"),
  },
  {
    title: "Tambah",
    href: route("bedtype.create"),
  },
];

export default function BedTypeCreate() {
  const { data, setData, post, processing, errors } = useForm<BedType.Create>();

  function handleCreateBedType(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Menambahkan tipe kasur...", { id: "create-bed-type" });
    post(route("bedtype.store"), {
      onError: () => toast.error("Tipe kasur gagal ditambahkan", { id: "create-bed-type" }),
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Tipe Kasur" />
      <h1 className="mb-6 text-2xl font-bold">Tambah Tipe Kasur</h1>
      <form
        onSubmit={handleCreateBedType}
        className="max-w-lg space-y-6"
      >
        <div className="grid gap-2">
          <Label htmlFor="name">Nama</Label>
          <Input
            id="name"
            type="text"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
          />
          <InputError message={errors.name} />
        </div>

        <Button type="submit" disabled={processing}>
          Simpan
        </Button>
      </form>
    </AppLayout>
  );
}
