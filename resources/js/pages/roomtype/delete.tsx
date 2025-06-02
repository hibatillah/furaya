import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { AlertOctagonIcon } from "lucide-react";
import { toast } from "sonner";

export default function RoomTypeDelete(props: { id: string; canDelete: boolean; onClose: () => void }) {
  const { id, canDelete, onClose } = props;

  const form = useForm();

  // Handle delete room type
  function handleDelete(e: React.FormEvent, id: string) {
    e.preventDefault();

    if (!canDelete) {
      toast.warning("Tipe kamar memiliki kamar berkaitan", {
        id: `delete-roomtype-${id}`,
        description: "Kosongkan tipe kamar dari kamar berkaitan",
      });
      return;
    }

    toast.loading("Menghapus tipe kamar...", {
      id: `delete-roomtype-${id}`,
    });

    form.delete(route("roomtype.destroy", { id }), {
      onSuccess: () => {
        onClose();
        toast.success("Tipe kamar berhasil dihapus", {
          id: `delete-roomtype-${id}`,
        });
      },
      onError: (error) => {
        toast.error("Tipe kamar gagal dihapus", {
          id: `delete-roomtype-${id}`,
          description: error.message,
        });
      },
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Hapus Tipe Kamar</DialogTitle>
        <DialogDescription>Apakah anda yakin ingin menghapus tipe kamar ini?</DialogDescription>
      </DialogHeader>
      {!canDelete && (
        <Alert variant="destructive">
          <AlertOctagonIcon className="size-4" />
          <AlertTitle>Peringatan</AlertTitle>
          <AlertDescription>Tipe kamar hanya bisa dihapus jika tidak ada kamar yang menggunakan tipe kamar ini</AlertDescription>
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
