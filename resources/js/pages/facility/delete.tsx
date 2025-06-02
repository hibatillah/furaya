import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { AlertOctagonIcon } from "lucide-react";
import { toast } from "sonner";

export default function FacilityDelete(props: { id: string; canDelete: boolean; onClose: () => void }) {
  const { id, canDelete, onClose } = props;

  const form = useForm();

  // Handle delete facility
  function handleDelete(e: React.FormEvent, id: string) {
    e.preventDefault();

    if (!canDelete) {
      toast.warning("Fasilitas memiliki kamar berkaitan", {
        id: `delete-facility-${id}`,
        description: "Kosongkan fasilitas dari kamar berkaitan",
      });
      return;
    }

    toast.loading("Menghapus fasilitas...", { id: `delete-facility-${id}` });
    form.delete(route("facility.destroy", { id }), {
      onSuccess: () => {
        toast.success("Fasilitas berhasil dihapus", { id: `delete-facility-${id}` });
        onClose();
      },
      onError: (error) =>
        toast.error("Fasilitas gagal dihapus", {
          id: `delete-facility-${id}`,
          description: error.message,
        }),
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Hapus Fasilitas</DialogTitle>
        <DialogDescription>Apakah anda yakin ingin menghapus fasilitas ini?</DialogDescription>
      </DialogHeader>
      {!canDelete && (
        <Alert variant="destructive">
          <AlertOctagonIcon className="size-4" />
          <AlertTitle>Peringatan</AlertTitle>
          <AlertDescription>Fasilitas hanya bisa dihapus jika tidak ada kamar yang berkaitan dengan fasilitas ini</AlertDescription>
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
