import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function RateTypeDelete(props: { id: string; onClose: () => void }) {
  const { id, onClose } = props;

  const form = useForm();

  // Handle delete rate type
  function handleDelete(e: React.FormEvent, id: string) {
    e.preventDefault();

    toast.loading("Menghapus tipe tarif...", { id: `delete-rate-type-${id}` });
    form.delete(route("rate.type.destroy", { id }), {
      onSuccess: () => {
        toast.success("Tipe tarif berhasil dihapus", { id: `delete-rate-type-${id}` });
        onClose();
      },
      onError: (error) =>
        toast.error("Tipe tarif gagal dihapus", {
          id: `delete-rate-type-${id}`,
          description: error.message,
        }),
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Hapus Tipe Tarif</DialogTitle>
        <DialogDescription>Apakah anda yakin ingin menghapus tipe tarif ini?</DialogDescription>
      </DialogHeader>
      <div className="flex items-center justify-end gap-2">
        <DialogClose asChild>
          <Button
            variant="outline"
            type="button"
          >
            Batal
          </Button>
        </DialogClose>
        <form onSubmit={(e) => handleDelete(e, id)}>
          <Button
            variant="destructive"
            type="submit"
            className="cursor-pointer"
          >
            Hapus
          </Button>
        </form>
      </div>
    </>
  );
}
