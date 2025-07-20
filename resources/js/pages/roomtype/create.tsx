import InputError from "@/components/input-error";
import Multiselect from "@/components/multiselect";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Option } from "@/components/ui/multiselect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UploadFile from "@/components/upload-file";
import { useFileUpload } from "@/hooks/use-file-upload";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
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

export default function RoomTypeCreate(props: { facilities: Facility.Default[]; rateTypes: RateType.Default[]; bedTypes: BedType.Default[] }) {
  const { facilities, rateTypes, bedTypes } = props;

  const { data, setData, post, errors, processing, reset } = useForm<RoomType.Create>({
    code: "",
    name: "",
    capacity: "",
    size: "",
    base_rate: "",
    bed_type_id: "",
    rate_type_id: "",
    facilities: [],
    images: [],
  });

  const [selectedFacilities, setSelectedFacilities] = useState<Option[]>([]);
  const [selectedRateType, setSelectedRateType] = useState<RateType.Default | null>(null);

  // define facility options for multiselect
  const facilityOptions = useMemo(() => {
    return facilities.map((facility) => ({
      value: facility.id,
      label: facility.name,
    }));
  }, [facilities]);

  // handle file upload
  const [fileUploadState, fileUploadActions] = useFileUpload({
    accept: "image/*",
    maxSize: 5 * 1024 * 1024,
    multiple: true,
    maxFiles: 6,
  });

  useEffect(() => {
    setData(
      "images",
      fileUploadState.files.map((file) => file.file as File),
    );
  }, [fileUploadState.files]);

  // handle create room type
  function handleCreateRoomType(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Membuat tipe kamar...", {
      id: "create-room-type",
    });

    post(route("roomtype.store"), {
      forceFormData: true,
      onSuccess: () => {
        reset();
        toast.success("Tipe kamar berhasil ditambahkan", {
          id: "create-room-type",
        });
      },
      onError: (error) => {
        toast.error("Tipe kamar gagal ditambahkan", {
          id: "create-room-type",
          description: error.message,
        });
      },
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Tipe Kamar" />
      <Card>
        <CardHeader>
          <CardTitle>Tambah Tipe Kamar</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCreateRoomType}
            className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3"
          >
            {/* code */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="code"
                required
              >
                Kode
              </Label>
              <Input
                id="code"
                type="text"
                value={data.code}
                placeholder="Kode"
                onChange={(e) => setData("code", e.target.value)}
                autoComplete="off"
                required
              />
              <InputError message={errors.code} />
            </div>

            {/* name */}
            <div className="flex flex-col gap-2">
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
                placeholder="Nama"
                onChange={(e) => setData("name", e.target.value)}
                autoComplete="off"
                required
              />
              <InputError message={errors.name} />
            </div>

            {/* rate type */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="rate_type_id"
                required
              >
                Tipe Tarif
              </Label>
              <Select
                value={data.rate_type_id}
                onValueChange={(value) => {
                  const rateType = rateTypes.find((type) => type.id === value);

                  setData("rate_type_id", value);
                  setSelectedRateType(rateType ?? null);
                  setData("base_rate", rateType?.rate ?? "");
                }}
                required
              >
                <SelectTrigger id="rate_type_id">
                  <SelectValue placeholder="Pilih Tipe Tarif">
                    <span className="capitalize">{selectedRateType?.name}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {rateTypes.map((type) => (
                    <SelectItem
                      key={type.id}
                      value={type.id}
                      className="capitalize"
                    >
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.rate_type_id} />
            </div>

            {/* base rate */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="base_rate"
                required
              >
                Tarif Dasar
              </Label>
              <div className="relative">
                <Input
                  id="base_rate"
                  type="number"
                  min={0}
                  step="any"
                  value={data.base_rate}
                  placeholder="Tarif Dasar"
                  onChange={(e) => setData("base_rate", parseFloat(e.target.value))}
                  className="ps-9"
                  autoComplete="off"
                  disableHandle
                  required
                />
                <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-1 flex items-center px-2 text-sm select-none">
                  Rp
                </span>
              </div>
              <InputError message={errors.base_rate} />
            </div>

            {/* bed type */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="bed_type_id"
                required
              >
                Tipe Kasur
              </Label>
              <Select
                value={data.bed_type_id}
                onValueChange={(value) => setData("bed_type_id", value)}
                disabled={bedTypes.length === 0}
                required
              >
                <SelectTrigger id="bed_type_id">
                  <SelectValue placeholder="Pilih Tipe Kasur">
                    <span className="capitalize">{bedTypes.find((type) => type.id === data.bed_type_id)?.name}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {bedTypes.map((type) => (
                    <SelectItem
                      key={type.id}
                      value={type.id}
                      className="capitalize"
                    >
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.bed_type_id} />
            </div>

            {/* capacity */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="capacity"
                required
              >
                Kapasitas
              </Label>
              <div className="relative">
                <Input
                  id="capacity"
                  type="number"
                  value={data.capacity}
                  placeholder="Kapasitas"
                  onChange={(e) => setData("capacity", parseInt(e.target.value))}
                  autoComplete="off"
                  disableHandle
                  required
                />
                <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-1 flex items-center px-2 text-sm select-none">
                  Orang
                </span>
              </div>
              <InputError message={errors.capacity} />
            </div>

            {/* size */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="size"
                required
              >
                Luas Kamar
              </Label>
              <div className="relative">
                <Input
                  id="size"
                  type="number"
                  value={data.size}
                  placeholder="Input luas kamar"
                  onChange={(e) => setData("size", parseInt(e.target.value))}
                  autoComplete="off"
                  disableHandle
                  required
                />
                <span className="text-muted-foreground absolute inset-y-0 end-4 flex items-center after:absolute after:-end-1.5 after:top-1 after:text-[8px] after:content-['2']">
                  m
                </span>
              </div>
              <InputError message={errors.size} />
            </div>

            {/* facilities */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="facilities">Fasilitas</Label>
              <Multiselect
                label="Fasilitas"
                data={facilityOptions}
                value={selectedFacilities}
                onChange={(value) => {
                  setSelectedFacilities(value);
                  setData(
                    "facilities",
                    value.map((item) => item.value),
                  );
                }}
              />
              <InputError message={errors.facilities} />
            </div>

            {/* images */}
            <div className="flex flex-col gap-2 xl:col-start-3 xl:row-span-4 xl:row-start-1">
              <Label htmlFor="images">Gambar</Label>
              <UploadFile
                options={fileUploadState}
                actions={fileUploadActions}
                multiple
              />
              <InputError message={errors.images} />
            </div>

            <SubmitButton
              disabled={processing}
              loading={processing}
              loadingText="Menambahkan..."
              className="w-fit lg:col-span-full lg:place-self-end"
            >
              Tambah
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
