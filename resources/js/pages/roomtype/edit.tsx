import InputError from "@/components/input-error";
import Multiselect from "@/components/multiselect";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Option } from "@/components/ui/multiselect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UploadFile from "@/components/upload-file";
import { FileMetadata, useFileUpload } from "@/hooks/use-file-upload";
import AppLayout from "@/layouts/app-layout";
import { fetchImageMetadata } from "@/lib/utils";
import { BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function RoomTypeEdit(props: {
  roomType: RoomType.Default;
  facilities: Facility.Default[];
  rateTypes: RateType.Default[];
  bedTypes: BedType.Default[];
}) {
  const { roomType, facilities: facilitiesData, rateTypes, bedTypes } = props;
  const { can_delete, images, rooms_count, facility, rate_type, bed_type, facilities_count, ...rest } = roomType;

  // define breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Tipe Kamar",
      href: route("roomtype.index"),
    },
    {
      title: "Edit",
      href: route("roomtype.edit", { id: roomType.id }),
    },
  ];

  const [selectedRateType, setSelectedRateType] = useState<RateType.Default | null>(
    rateTypes.find((type) => type.id === roomType.rate_type_id) ?? null,
  );

  // handle selected facilities for multiselect
  const [selectedFacilities, setSelectedFacilities] = useState<Option[]>(
    facility?.map((item) => ({
      value: item.id,
      label: item.name || "",
    })) || [],
  );

  // define facility options for multiselect
  const facilityOptions = useMemo(() => {
    return facilitiesData?.map((facility) => ({
      value: facility.id,
      label: facility.name,
    }));
  }, [facilitiesData]);

  // define form data
  const { data, setData, post, processing, errors } = useForm<RoomType.Update>({
    ...rest,
    facilities: facility?.map((item) => item.id) || [],
    images: [],
  });

  // set initial images
  const [initialImageMetadata, setInitialImageMetadata] = useState<FileMetadata[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      if (!roomType?.formatted_images) return;

      const metadata = await fetchImageMetadata(roomType.formatted_images);
      setInitialImageMetadata(metadata);
      fileUploadActions.addFiles(metadata.map((item) => item.file as File));
    };

    loadImages();
  }, [roomType?.formatted_images]);

  // handle file upload
  const [fileUploadState, fileUploadActions] = useFileUpload({
    accept: "image/*",
    maxSize: 5 * 1024 * 1024,
    multiple: true,
    maxFiles: 6,
    initialFiles: initialImageMetadata.map((item) => ({
      name: item.name,
      size: item.size,
      type: item.type,
      url: item.url,
      id: item.id,
    })),
  });

  useEffect(() => {
    setData(
      "images",
      fileUploadState.files.map((file) => file.file as File),
    );
  }, [fileUploadState.files]);

  // handle update room type data
  function handleUpdateRoomType(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Memperbarui tipe kamar...", {
      id: `update-room-type-${data.id}`,
    });

    post(route("roomtype.update", { id: data.id }), {
      method: "put",
      forceFormData: true,
      onSuccess: () => {
        toast.success("Tipe kamar berhasil diperbarui", {
          id: `update-room-type-${data.id}`,
        });
      },
      onError: (error) => {
        console.log(error);
        toast.error("Tipe kamar gagal diperbarui", {
          id: `update-room-type-${data.id}`,
          description: error.message,
        });
      },
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Tipe Kamar ${roomType.name}`} />
      <Card>
        <CardHeader>
          <CardTitle>Edit Tipe Kamar</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleUpdateRoomType}
            className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3"
          >
            {/* code */}
            <div className="grid gap-2">
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
                onChange={(e) => setData("code", e.target.value)}
                autoComplete="off"
                required
              />
              <InputError message={errors.code} />
            </div>

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
                autoComplete="off"
                required
              />
              <InputError message={errors.name} />
            </div>

            {/* rate type */}
            <div className="grid gap-2">
              <Label
                htmlFor="rate_type_id"
                required
              >
                Tipe Tarif
              </Label>
              <Select
                value={selectedRateType?.id}
                onValueChange={(value) => {
                  const rateType = rateTypes.find((type) => type.id === value);

                  setData("rate_type_id", value);
                  setSelectedRateType(rateType ?? null);
                  setData("base_rate", rateType?.rate ?? "");
                }}
              >
                <SelectTrigger id="rate_type_id">
                  <SelectValue>
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
            <div className="grid gap-2">
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
            <div className="grid gap-2">
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
              >
                <SelectTrigger id="bed_type_id">
                  <SelectValue>
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
                  step="any"
                  value={data.size}
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
            <div className="grid gap-2">
              <Label htmlFor="facilities">Fasilitas</Label>
              <Multiselect
                label="Fasilitas"
                data={facilityOptions}
                value={selectedFacilities}
                onChange={(value) => {
                  setSelectedFacilities(value);
                  setData("facilities", value.length > 0 ? value.map((item) => item.value) : []);
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

            <div className="flex justify-end gap-2 lg:col-span-full">
              <SubmitButton
                disabled={processing}
                loading={processing}
                loadingText="Memperbarui..."
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
