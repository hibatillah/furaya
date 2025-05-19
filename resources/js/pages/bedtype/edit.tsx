import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
export default function BedTypeEdit(props: { bedType: BedType.Default }) {
  const { bedType } = props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Tipe Kasur",
      href: route("bedtype.index"),
    },
    {
      title: "Edit",
      href: route("bedtype.edit", { id: bedType.id }),
    },
  ];

  const { data, setData, put, processing, errors } = useForm<BedType.Update>(bedType);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Mengubah tipe kasur...", { id: "edit-bed-type" });
    put(route("bedtype.update", { id: bedType.id }), {
      onError: () => toast.error("Tipe kasur gagal diubah", { id: "edit-bed-type" }),
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Tipe Kasur" />
      <h1 className="mb-6 text-2xl font-bold">Edit Tipe Kasur</h1>
      <form
        onSubmit={handleSubmit}
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

        <Button type="submit" className="w-full" disabled={processing}>
          {processing ? "Mengubah..." : "Simpan"}
        </Button>
      </form>
    </AppLayout>
  );
}
