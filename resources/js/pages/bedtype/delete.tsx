import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { AlertOctagonIcon } from "lucide-react";
import { toast } from "sonner";

export default function BedTypeDelete(props: { id: string; canDelete: boolean; onClose: () => void }) {
  const { id, canDelete, onClose } = props;

  const form = useForm();

  // Handle delete bed type
  function handleDelete(e: React.FormEvent, id: string) {
    e.preventDefault();

    if (!canDelete) {
      toast.warning("Tipe kasur memiliki kamar berkaitan", {
        id: `delete-bedtype-${id}`,
        description: "Kosongkan tipe kasur dari kamar berkaitan",
      });
      return;
    }

    toast.loading("Menghapus tipe kasur...", { id: `delete-bedtype-${id}` });
    form.delete(route("bedtype.destroy", { id }), {
      onSuccess: () => {
        toast.success("Tipe kasur berhasil dihapus", { id: `delete-bedtype-${id}` });
        onClose();
      },
      onError: (error) =>
        toast.error("Tipe kasur gagal dihapus", {
          id: `delete-bedtype-${id}`,
          description: error.message,
        }),
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Hapus Tipe Kasur</DialogTitle>
        <DialogDescription>Apakah anda yakin ingin menghapus tipe kasur ini?</DialogDescription>
      </DialogHeader>
      {!canDelete && (
      <Alert variant="destructive">
        <AlertOctagonIcon className="size-4" />
        <AlertTitle>Peringatan</AlertTitle>
        <AlertDescription>Tipe kasur hanya bisa dihapus jika tidak ada kamar yang berkaitan dengan tipe kasur ini</AlertDescription>
      </Alert>
      )}
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
            disabled={!canDelete}
            className="cursor-pointer"
          >
            Hapus
          </Button>
        </form>
      </div>
    </>
  );
}
