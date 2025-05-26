import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { AlertOctagonIcon } from "lucide-react";
import { toast } from "sonner";

export default function BedTypeDelete({ id, onClose }: { id: string; onClose: () => void }) {
  const form = useForm();

  // Handle delete bed type
  function handleDelete(e: React.FormEvent, id: string) {
    e.preventDefault();

    toast.loading("Menghapus tipe kasur...", { id: `delete-bedtype-${id}` });
    form.delete(route("bedtype.destroy", { id }), {
      onSuccess: () => {
        toast.success("Tipe kasur berhasil dihapus", { id: `delete-bedtype-${id}` });
        onClose();
      },
      onError: () => toast.error("Tipe kasur gagal dihapus", { id: `delete-bedtype-${id}` }),
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Hapus Tipe Kasur</DialogTitle>
        <DialogDescription>Apakah anda yakin ingin menghapus tipe kasur ini?</DialogDescription>
      </DialogHeader>
      <Alert variant="destructive">
        <AlertOctagonIcon className="size-4" />
        <AlertTitle>Peringatan</AlertTitle>
        <AlertDescription>Data Kamar yang berkaitan tidak akan memiliki Tipe Kasur</AlertDescription>
      </Alert>
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
