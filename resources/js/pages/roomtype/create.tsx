import InputError from "@/components/input-error";
import Multiselect from "@/components/multiselect";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Option } from "@/components/ui/multiselect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "@inertiajs/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function RoomTypeCreate({ facilities, rateTypes }: { facilities: Facility.Default[]; rateTypes: RateType.Default[] }) {
  const { data, setData, post, errors, processing, reset } = useForm<RoomType.Create>();

  const [open, setOpen] = useState(false);
  const [selectedFacilities, setSelectedFacilities] = useState<Option[]>([]);
  const [selectedRateType, setSelectedRateType] = useState<RateType.Default | null>(null);

  // define facility options for multiselect
  const facilityOptions = useMemo(() => {
    return facilities.map((facility) => ({
      value: facility.id,
      label: facility.name,
    }));
  }, [facilities]);

  // handle create room type
  function handleCreateRoomType(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Membuat tipe kamar...", {
      id: "create-room-type",
    });

    post(route("roomtype.store"), {
      onSuccess: () => {
        reset();
        setOpen(false);
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
    <Dialog
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
        reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="ms-auto">Tambah Tipe Kamar</Button>
      </DialogTrigger>
      <DialogContent
        tabIndex={-1}
        className="!max-w-200"
      >
        <DialogHeader>
          <DialogTitle>Tambah Tipe Kamar</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleCreateRoomType}
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
              value={data.rate_type_id}
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
                step={25000}
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

          <SubmitButton
            disabled={processing}
            loading={processing}
            loadingText="Menambahkan..."
            className="w-fit lg:col-span-2 lg:place-self-end"
          >
            Tambah
          </SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
