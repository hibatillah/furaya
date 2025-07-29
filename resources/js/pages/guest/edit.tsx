import InputError from "@/components/input-error";
import SelectCountry from "@/components/select-country";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

export default function GuestEdit(props: { guest: Guest.Default; countries: { code: string; name: string }[] }) {
  const { guest, countries } = props;
  const { user, formatted_birthdate, formatted_gender, ...dataGuest } = guest;
  console.log(dataGuest);

  // define page breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Tamu",
      href: route("guest.index"),
    },
    {
      title: "Edit",
      href: route("guest.edit", { id: guest.id }),
    },
  ];

  // define form state
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(dataGuest.country);
  const [selectedNationality, setSelectedNationality] = useState<string | undefined>(dataGuest.nationality);
  const { data, setData, put, processing, errors } = useForm<Guest.Update>({
    ...dataGuest,
    name: user?.name,
    email: user?.email,
  });

  // define form submit handler
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(data);

    toast.loading("Memperbarui data tamu...", {
      id: `update-guest-${guest.id}`,
    });

    put(route("guest.update", { id: guest.id }), {
      onError: (error) => {
        toast.error("Tamu gagal diperbarui", {
          id: `update-guest-${guest.id}`,
          description: error.message,
        });
      },
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Customer" />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid grid-cols-2 gap-6"
            onSubmit={handleSubmit}
          >
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
              />
              <InputError message={errors.name} />
            </div>

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
              />
              <InputError message={errors.email} />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="phone"
                required
              >
                No. HP
              </Label>
              <Input
                id="phone"
                type="text"
                value={data.phone}
                onChange={(e) => setData("phone", e.target.value)}
                required
              />
              <InputError message={errors.phone} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nik_passport">NIK/Passport</Label>
              <Input
                id="nik_passport"
                type="text"
                value={data.nik_passport}
                onChange={(e) => setData("nik_passport", e.target.value)}
                required
              />
              <InputError message={errors.nik_passport} />
            </div>

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
                  <SelectValue>
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

            <div className="grid gap-2">
              <Label
                htmlFor="birthdate"
                required
              >
                Tanggal Lahir
              </Label>
              <DatePicker
                value={data.birthdate as Date}
                onChange={(date) => setData("birthdate", format(date, "yyyy-MM-dd"))}
                className="bg-accent w-full"
              />
              <InputError message={errors.birthdate} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="profession">Profesi</Label>
              <Input
                id="profession"
                type="text"
                value={data.profession}
                onChange={(e) => setData("profession", e.target.value)}
                required
              />
              <InputError message={errors.profession} />
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
              <Label htmlFor="nationality">Kewarganegaraan</Label>
              <SelectCountry
                label="Kewarganegaraan"
                data={countries}
                value={selectedNationality}
                setValue={({ code, name }) => {
                  setSelectedNationality(name);
                  setData((prev) => ({
                    ...prev,
                    nationality: name,
                    nationality_code: code,
                  }));
                }}
                noLabel
              />
              <InputError message={errors.nationality} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nationality">Asal Negara</Label>
              <SelectCountry
                label="Asal Negara"
                data={countries}
                value={selectedCountry}
                setValue={({ code, name }) => {
                  setSelectedCountry(name);
                  setData((prev) => ({
                    ...prev,
                    country: name,
                    country_code: code,
                  }));
                }}
                noLabel
              />
              <InputError message={errors.country} />
            </div>

            <div className="col-span-2 flex justify-end gap-2">
              <Button
                type="submit"
                disabled={processing}
              >
                Perbarui
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
