import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import RadioGroupCard from '@/components/radio-group-card';
import { format } from "date-fns"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Karyawan',
    href: route('employee.index'),
  },
  {
    title: 'Tambah',
    href: route('employee.create'),
  },
];

export default function EmployeeCreate() {
  const items: SelectData[] = [
    { label: 'Laki-laki', value: 'male' },
    { label: 'Perempuan', value: 'female' },
  ];

  const { data, setData, post, processing, errors } = useForm<Employee.Create>();

  function handleCreateEmployee(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Menambahkan karyawan...", { id: "create-employee" });
    post(route("employee.store"), {
      onError: () => toast.warning("Karyawan gagal ditambahkan", { id: "create-employee" }),
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Karyawan" />
      <h1 className="mb-6 text-2xl font-bold">Tambah Karyawan</h1>
      <form
        onSubmit={handleCreateEmployee}
        className="max-w-lg space-y-6"
      >
        <div className="grid gap-2">
          <Label htmlFor="user_id">Nama</Label>
          <Input
            id="user_id"
            type="text"
            value={data.user_id}
            onChange={(e) => setData("user_id", e.target.value)}
          />
          <InputError message={errors.user_id} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="department_id">Departemen</Label>
          <Input
            id="department_id"
            type="text"
            value={data.department_id}
            onChange={(e) => setData("department_id", e.target.value)}
          />
          <InputError message={errors.department_id} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="gender">Jenis Kelamin</Label>
          <RadioGroupCard items={items} />
          <InputError message={errors.gender} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Nomor Telepon</Label>
          <Input
            id="phone"
            type="text"
            value={data.phone}
            onChange={(e) => setData("phone", e.target.value)}
          />
          <InputError message={errors.phone} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="address">Alamat</Label>
          <Input
            id="address"
            type="text"
            value={data.address}
            onChange={(e) => setData("address", e.target.value)}
          />
          <InputError message={errors.address} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="hire_date">Tanggal Bergabung</Label>
          <Input
            id="hire_date"
            type="date"
            value={format(data.hire_date, "yyyy-MM-dd")}
            onChange={(e) => setData("hire_date", e.target.value)}
          />
          <InputError message={errors.hire_date} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="salary">Gaji</Label>
          <Input
            id="salary"
            type="number"
            value={data.salary}
            onChange={(e) => setData("salary", parseInt(e.target.value))}
          />
          <InputError message={errors.salary} />
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
