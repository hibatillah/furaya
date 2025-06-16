import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function GuestTypeDelete(props: { id: string; onClose: () => void }) {
  const { id, onClose } = props;

  const form = useForm();

  // Handle delete bed type
  function handleDelete(e: React.FormEvent, id: string) {
    e.preventDefault();

    toast.loading("Menghapus tipe tamu...", { id: `delete-guesttype-${id}` });
    form.delete(route("guest.type.destroy", { id }), {
      onSuccess: () => {
        toast.success("Tipe tamu berhasil dihapus", { id: `delete-guesttype-${id}` });
        onClose();
      },
      onError: (error) =>
        toast.error("Tipe tamu gagal dihapus", {
          id: `delete-guesttype-${id}`,
          description: error.message,
        }),
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Hapus Tipe Tamu</DialogTitle>
        <DialogDescription>Apakah anda yakin ingin menghapus tipe tamu ini?</DialogDescription>
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
