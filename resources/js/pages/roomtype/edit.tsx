import InputError from "@/components/input-error";
import Multiselect from "@/components/multiselect";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Option } from "@/components/ui/multiselect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "@inertiajs/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function RoomTypeEdit(props: {
  data: RoomType.Default;
  facilities: Facility.Default[];
  rateTypes: RateType.Default[];
  smokingTypes: Enum.SmokingType[];
  onClose: () => void;
}) {
  const { data: roomType, facilities: facilitiesData, smokingTypes, rateTypes, onClose } = props;
  const { can_delete, rooms_count, facility, facilities_count, ...rest } = roomType;

  // define form data
  const { data, setData, put, processing, errors } = useForm<RoomType.Update>({
    ...rest,
    facilities: facility?.map((item) => item.id),
  });

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

  // handle update room type data
  function handleUpdateRoomType(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Memperbarui tipe kamar...", {
      id: `update-room-type-${data.id}`,
    });

    put(route("roomtype.update", { id: data.id }), {
      onSuccess: () => {
        toast.success("Tipe kamar berhasil diperbarui", {
          id: `update-room-type-${data.id}`,
        });
      },
      onError: (error) => {
        toast.error("Tipe kamar gagal diperbarui", {
          id: `update-room-type-${data.id}`,
          description: error.message,
        });
      },
      onFinish: () => onClose(),
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Tipe Kamar</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={handleUpdateRoomType}
        className="grid gap-6 lg:grid-cols-2"
      >
        {/* code */}
        <div className="grid gap-2">
          <Label htmlFor="code">Kode</Label>
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
        <div className="grid gap-2">
          <Label htmlFor="name">Nama</Label>
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
        <div className="grid gap-2">
          <Label htmlFor="rate_type_id">Tipe Tarif</Label>
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
        <div className="grid gap-2">
          <Label htmlFor="base_rate">Tarif Dasar</Label>
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

        {/* capacity */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="capacity">Kapasitas</Label>
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
          <Label htmlFor="size">Luas Kamar</Label>
          <div className="relative">
            <Input
              id="size"
              type="number"
              step="any"
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

        {/* smoking type */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="smoking_type">Smoking Type</Label>
          <Select
            value={data.smoking_type}
            onValueChange={(value) => setData("smoking_type", value as Enum.SmokingType)}
          >
            <SelectTrigger id="smoking_type">
              <SelectValue placeholder="Pilih Smoking Type" />
            </SelectTrigger>
            <SelectContent>
              {smokingTypes.map((type) => (
                <SelectItem
                  key={type}
                  value={type}
                  className="capitalize"
                >
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <InputError message={errors.rate_type_id} />
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
              setData(
                "facilities",
                value.map((item) => item.value),
              );
            }}
          />
          <InputError message={errors.facilities} />
        </div>

        <div className="flex justify-end gap-2 lg:col-span-2">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Batal
          </Button>
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
    </>
  );
}
