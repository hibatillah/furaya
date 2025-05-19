import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function DepartmentEdit(props: { department: Department.Default }) {
  const { department } = props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Department",
      href: route("department.index"),
    },
    {
      title: "Edit",
      href: route("department.edit", { id: department.id }),
    },
  ];

  const { data, setData, put, errors, processing } = useForm<Department.Update>(department);

  function handleUpdateDepartment(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Mengubah departemen...", { id: "update-department" });
    put(route("department.update", { id: department.id }), {
      onError: () => toast.error("Departemen gagal diubah", { id: "update-department" }),
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Department" />
      <h1 className="text-2xl font-bold">Edit Departemen</h1>
      <form
        onSubmit={handleUpdateDepartment}
        className="flex flex-col gap-4"
      >
        <div className="grid">
          <Label>Nama Departemen</Label>
          <Input
            name="name"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            placeholder="Masukkan nama departemen"
          />
          <InputError message={errors.name} />
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
