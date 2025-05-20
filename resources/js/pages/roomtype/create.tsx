import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function RoomTypeCreate() {
  const { data, setData, post, errors, processing } = useForm<RoomType.Create>();

  // handle create room type
  function handleCreateRoomType(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Membuat tipe kamar...", {
      id: "create-room-type",
    });

    post(route("roomtype.store"), {
      onSuccess: () =>
        toast.success("Tipe kamar berhasil ditambahkan", {
          id: "create-room-type",
        }),
      onError: () =>
        toast.error("Tipe kamar gagal ditambahkan", {
          id: "create-room-type",
        }),
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ms-auto w-fit">Tambah Tipe Kamar</Button>
      </DialogTrigger>
      <DialogContent className="w-120">
        <DialogHeader>
          <DialogTitle>Tambah Tipe Kamar</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleCreateRoomType}
          className="max-w-lg space-y-6"
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

          <Button
            type="submit"
            disabled={processing}
            className="w-full"
          >
            Tambah
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
