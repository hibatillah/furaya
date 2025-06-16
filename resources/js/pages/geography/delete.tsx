import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function GeographyDelete(props: { id: string; onClose: () => void }) {
  const { id, onClose } = props;

  const form = useForm();

  // Handle delete geography
  function handleDelete(e: React.FormEvent, id: string) {
    e.preventDefault();

    toast.loading("Menghapus geografi...", { id: `delete-geography-${id}` });
    form.delete(route("geography.destroy", { id }), {
      onSuccess: () => {
        toast.success("Geografi berhasil dihapus", { id: `delete-geography-${id}` });
        onClose();
      },
      onError: (error) =>
        toast.error("Geografi gagal dihapus", {
          id: `delete-geography-${id}`,
          description: error.message,
        }),
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Hapus Geografi</DialogTitle>
        <DialogDescription>Apakah anda yakin ingin menghapus geografi ini?</DialogDescription>
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
