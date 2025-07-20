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

export default function EmployeeEdit(props: { employee: Employee.Default; departments: Department.Default[] }) {
  const { employee, departments } = props;
  const { user, department, formatted_hire_date, formatted_gender, ...employeeData } = employee;

  // define page breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Karyawan",
      href: route("employee.index"),
    },
    {
      title: "Edit",
      href: route("employee.edit", { id: employee.id }),
    },
  ];

  // define form data
  const { data, setData, put, processing, errors } = useForm<Employee.Update>({
    ...employeeData,
    user_id: user?.id,
    name: user?.name,
    email: user?.email,
  });

  // handle update role data
  function handleUpdateRole(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Memperbarui karyawan...", {
      id: `update-employee-${data.id}`,
    });

    put(route("employee.update", { id: data.id }), {
      onError: (error) => {
        toast.error("Karyawan gagal diperbarui", {
          id: `update-employee-${data.id}`,
          description: error.message,
        });
      },
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Karyawan" />
      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl font-bold">Edit Karyawan</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleUpdateRole}
            className="grid grid-cols-2 gap-6"
          >
            {/* name */}
            <div className="grid gap-2">
              <Label
                htmlFor="name"
                required
              >
                Nama
              </Label>
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

            {/* email */}
            <div className="grid gap-2">
              <Label
                htmlFor="email"
                required
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                required
                placeholder="Email"
              />
              <InputError message={errors.email} />
            </div>

            {/* phone */}
            <div className="grid gap-2">
              <Label
                htmlFor="phone"
                required
              >
                Nomor Telepon
              </Label>
              <Input
                id="phone"
                type="text"
                value={data.phone}
                onChange={(e) => setData("phone", e.target.value)}
                placeholder="Nomor Telepon"
              />
              <InputError message={errors.phone} />
            </div>

            {/* gender */}
            <div className="grid gap-2">
              <Label
                htmlFor="gender"
                required
              >
                Gender
              </Label>
              <Select
                value={data.gender}
                onValueChange={(value) => setData("gender", value as Enum.Gender)}
              >
                <SelectTrigger id="room_type_id">
                  <SelectValue placeholder="Pilih Tipe Kamar">
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
              <Label
                htmlFor="department_id"
                required
              >
                Departemen
              </Label>
              <Select
                value={data.department_id}
                onValueChange={(value) => setData("department_id", value)}
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
              <Label
                htmlFor="hire_date"
                required
              >
                Tanggal Bergabung
              </Label>
              <DatePicker
                value={data.hire_date as Date}
                onChange={(date) => setData("hire_date", format(date, "yyyy-MM-dd"))}
                className="w-full bg-accent"
              />
              <InputError message={errors.hire_date} />
            </div>

            {/* salary */}
            <div className="grid gap-2">
              <Label
                htmlFor="salary"
                required
              >
                Gaji
              </Label>
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
              />
              <InputError message={errors.address} />
            </div>

            <div className="col-span-full flex justify-end gap-2">
              <SubmitButton
                disabled={processing}
                loading={processing}
                loadingText="Memperbarui karyawan..."
                className="w-fit"
              >
                Perbarui
              </SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
