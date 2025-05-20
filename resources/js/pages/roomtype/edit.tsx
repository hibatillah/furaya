import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function RoomTypeEdit(props: { data: RoomType.Default; onClose: () => void }) {
  const { data: roomType, onClose } = props;

  const { data, setData, put, processing, errors } = useForm<RoomType.Update>(roomType);

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
        onClose();
      },
      onError: () => {
        toast.error("Tipe kamar gagal diperbarui", {
          id: `update-room-type-${data.id}`,
        });
      },
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Tipe Kamar</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={handleUpdateRoomType}
        className="max-w-lg space-y-6"
      >
        <div className="grid gap-2">
          <Label htmlFor="name">Nama</Label>
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

        <div className="grid gap-2">
          <Label htmlFor="capacity">Kapasitas</Label>
          <Input
            id="capacity"
            type="number"
            value={data.capacity}
            onChange={(e) => setData("capacity", parseInt(e.target.value))}
            required
            placeholder="Kapasitas"
          />
          <InputError message={errors.capacity} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="base_rate">Tarif Dasar</Label>
          <Input
            id="base_rate"
            type="number"
            value={data.base_rate}
            onChange={(e) => setData("base_rate", parseFloat(e.target.value))}
            required
            placeholder="Tarif Dasar"
          />
          <InputError message={errors.base_rate} />
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <Button
            variant="outline"
            type="button"
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={processing}
          >
            Perbarui
          </Button>
        </div>
      </form>
    </>
  );
}
