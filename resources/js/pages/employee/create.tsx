import InputError from "@/components/input-error";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { format } from "date-fns";
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Karyawan",
    href: route("employee.index"),
  },
  {
    title: "Tambah",
    href: route("employee.create"),
  },
];

export default function EmployeeCreate(props: { departments: Department.Default[] }) {
  const { departments } = props;

  const { data, setData, post, processing, errors } = useForm<Employee.Create>();

  // handle create employee
  function handleCreateEmployee(e: React.FormEvent) {
    e.preventDefault();
    console.log(data);

    toast.loading("Menambahkan karyawan...", {
      id: `create-employee`,
    });

    post(route("employee.store"), {
      onError: (error) => {
        console.log(error);
        toast.error("Karyawan gagal ditambahkan", {
          id: `create-employee`,
          description: error.message,
        });
      },
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Karyawan" />
      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl font-bold">Tambah Karyawan</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCreateEmployee}
            className="grid grid-cols-2 gap-6"
          >
            {/* name */}
            <div className="grid gap-2">
              <Label htmlFor="name" required>Nama</Label>
              <Input
                id="name"
                type="text"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                placeholder="Nama"
                autoComplete="off"
                required
              />
              <InputError message={errors.name} />
            </div>

            {/* email */}
            <div className="grid gap-2">
              <Label htmlFor="email" required>Email</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                placeholder="Email"
                autoComplete="off"
                required
              />
              <InputError message={errors.email} />
            </div>

            {/* phone */}
            <div className="grid gap-2">
              <Label htmlFor="phone" required>Nomor Telepon</Label>
              <Input
                id="phone"
                type="text"
                value={data.phone}
                onChange={(e) => setData("phone", e.target.value)}
                placeholder="Nomor Telepon"
                autoComplete="off"
                required
              />
              <InputError message={errors.phone} />
            </div>

            {/* password */}
            <div className="grid gap-2">
              <Label htmlFor="password" required>Password</Label>
              <Input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                placeholder="Password"
                autoComplete="off"
                required
              />
              <InputError message={errors.password} />
            </div>

            {/* gender */}
            <div className="grid gap-2">
              <Label htmlFor="gender" required>Gender</Label>
              <Select
                value={data.gender}
                onValueChange={(value) => setData("gender", value as Enum.Gender)}
                required
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Pilih Gender">
                    <span className="capitalize">{data.gender === "male" ? "Pria" : "Wanita"}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    key="male"
                    value="male"
                  >
                    Pria
                  </SelectItem>
                  <SelectItem
                    key="female"
                    value="female"
                  >
                    Wanita
                  </SelectItem>
                </SelectContent>
              </Select>
              <InputError message={errors.gender} />
            </div>

            {/* department */}
            <div className="grid gap-2">
              <Label htmlFor="department_id" required>Departemen</Label>
              <Select
                value={data.department_id}
                onValueChange={(value) => setData("department_id", value)}
                required
              >
                <SelectTrigger id="department_id">
                  <SelectValue placeholder="Pilih Departemen">
                    <span>{departments.find((department) => department.id === data.department_id)?.name}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem
                      key={department.id}
                      value={department.id}
                    >
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.department_id} />
            </div>

            {/* hire date */}
            <div className="grid gap-2">
              <Label htmlFor="hire_date" required>Tanggal Bergabung</Label>
              <DatePicker
                value={data.hire_date as Date}
                onChange={(date) => setData("hire_date", format(date, "yyyy-MM-dd"))}
                className="w-full bg-accent"
              />
              <InputError message={errors.hire_date} />
            </div>

            {/* salary */}
            <div className="grid gap-2">
              <Label htmlFor="salary" required>Gaji</Label>
              <div className="relative">
                <Input
                  id="salary"
                  type="number"
                  value={data.salary}
                  onChange={(e) => setData("salary", Number(e.target.value))}
                  placeholder="Gaji"
                  className="ps-9"
                  disableHandle
                  autoComplete="off"
                  required
                />
                <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-3 flex items-center text-sm select-none">Rp</span>
              </div>
              <InputError message={errors.salary} />
            </div>

            {/* address */}
            <div className="grid gap-2">
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                type="text"
                value={data.address}
                onChange={(e) => setData("address", e.target.value)}
                placeholder="Alamat"
                autoComplete="off"
              />
              <InputError message={errors.address} />
            </div>

            <div className="col-span-full flex justify-end gap-2">
              <SubmitButton
                disabled={processing}
                loading={processing}
                loadingText="Membuat karyawan..."
                className="w-fit"
              >
                Tambah
              </SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
