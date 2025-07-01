import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function BedTypeEdit(props: { data: BedType.Default; onClose: () => void }) {
  const { data: bedType, onClose } = props;

  const { data, setData, put, processing, errors } = useForm<BedType.Update>(bedType);

  // handle update bed type data
  function handleUpdateBedType(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Memperbarui tipe kasur...", {
      id: `update-bed-type-${data.id}`,
    });

    put(route("bedtype.update", { id: data.id }), {
      onSuccess: () => {
        toast.success("Tipe kasur berhasil diperbarui", {
          id: `update-bed-type-${data.id}`,
        });
        onClose();
      },
      onError: (error) => {
        toast.error("Tipe kasur gagal diperbarui", {
          id: `update-bed-type-${data.id}`,
          description: error.message,
        });
      },
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Tipe Kasur</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={handleUpdateBedType}
        className="max-w-lg space-y-6"
      >
        <div className="grid gap-2">
          <Label htmlFor="name" required>Nama</Label>
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

        <div className="grid gap-3 lg:grid-cols-2">
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
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
