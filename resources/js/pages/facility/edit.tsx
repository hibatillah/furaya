import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function FacilityEdit(props: { data: Facility.Default; onClose: () => void }) {
  const { data: facility, onClose } = props;

  const { data, setData, put, processing, errors } = useForm<Facility.Update>(facility);

  // handle update facility data
  function handleUpdateFacility(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Memperbarui fasilitas...", {
      id: `update-facility-${data.id}`,
    });

    put(route("facility.update", { id: data.id }), {
      onSuccess: () => {
        toast.success("Fasilitas berhasil diperbarui", {
          id: `update-facility-${data.id}`,
        });
        onClose();
      },
      onError: (error) => {
        toast.error("Fasilitas gagal diperbarui", {
          id: `update-facility-${data.id}`,
          description: error.message,
        });
      },
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Fasilitas</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={handleUpdateFacility}
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
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            id="description"
            value={data.description}
            onChange={(e) => setData("description", e.target.value)}
            placeholder="Deskripsi"
          />
          <InputError message={errors.description} />
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
