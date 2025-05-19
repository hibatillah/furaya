import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Department",
    href: route("department.index"),
  },
  {
    title: "Tambah",
    href: route("department.create"),
  },
];

export default function DepartmentCreate() {
  const { data, setData, post, errors, processing } = useForm<Department.Create>();

  function handleCreateDepartment(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Menambahkan departemen...", { id: "create-department" });
    post(route("department.store"), {
      onError: () => toast.error("Departemen gagal ditambahkan", { id: "create-department" }),
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Department" />
      <h1 className="text-2xl font-bold">Tambah Departemen</h1>
      <form
        onSubmit={handleCreateDepartment}
        className="max-w-lg space-y-6"
      >
        <div className="grid gap-2">
          <Label htmlFor="name">Nama Departemen</Label>
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
