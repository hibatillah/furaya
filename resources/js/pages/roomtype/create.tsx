import InputError from "@/components/input-error";
import Multiselect from "@/components/multiselect";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Option } from "@/components/ui/multiselect";
import { useForm } from "@inertiajs/react";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function RoomTypeCreate({ facilities }: { facilities: Facility.Default[] }) {
  const { data, setData, post, errors, processing, reset } = useForm<RoomType.Create>();

  const [open, setOpen] = useState(false);
  const [selectedFacilities, setSelectedFacilities] = useState<Option[]>([]);

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
    <Dialog open={open} onOpenChange={(e) => {
      setOpen(e)
      reset()
    }}>
      <DialogTrigger asChild>
        <Button className="ms-auto">Tambah Tipe Kamar</Button>
      </DialogTrigger>
      <DialogContent tabIndex={-1} className="w-120">
        <DialogHeader>
          <DialogTitle>Tambah Tipe Kamar</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleCreateRoomType}
          className="space-y-6"
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              type="text"
              value={data.name}
              placeholder="Nama"
              onChange={(e) => setData("name", e.target.value)}
              required
            />
            <InputError message={errors.name} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="capacity">Kapasitas</Label>
            <Input
              id="capacity"
              type="number"
              value={data.capacity}
              placeholder="Kapasitas"
              onChange={(e) => setData("capacity", parseInt(e.target.value))}
              required
            />
            <InputError message={errors.capacity} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="base_rate">Tarif Dasar</Label>
            <Input
              id="base_rate"
              type="number"
              value={data.base_rate}
              placeholder="Tarif Dasar"
              onChange={(e) => setData("base_rate", parseFloat(e.target.value))}
              required
            />
            <InputError message={errors.base_rate} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="facilities">Fasilitas</Label>
            <Multiselect
              label="Fasilitas"
              data={facilityOptions}
              value={selectedFacilities}
              onChange={(value) => {
                setSelectedFacilities(value);
                setData("facilities", value.map((item) => item.value));
              }}
            />
            <InputError message={errors.facilities} />
          </div>

          <Button
            type="submit"
            disabled={processing}
            className="w-full"
          >
            {processing && <Loader2 className="size-4 animate-spin" />}
            Tambah Tipe Kamar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
