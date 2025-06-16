import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function NationalityDelete(props: { id: string; onClose: () => void }) {
  const { id, onClose } = props;

  const form = useForm();

  // Handle delete nationality
  function handleDelete(e: React.FormEvent, id: string) {
    e.preventDefault();

    toast.loading("Menghapus kewarganegaraan...", { id: `delete-nationality-${id}` });
    form.delete(route("nationality.destroy", { id }), {
      onSuccess: () => {
        toast.success("Kewarganegaraan berhasil dihapus", { id: `delete-nationality-${id}` });
        onClose();
      },
      onError: (error) =>
        toast.error("Kewarganegaraan gagal dihapus", {
          id: `delete-nationality-${id}`,
          description: error.message,
        }),
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Hapus Kewarganegaraan</DialogTitle>
        <DialogDescription>Apakah anda yakin ingin menghapus kewarganegaraan ini?</DialogDescription>
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
