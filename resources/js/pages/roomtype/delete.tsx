import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { AlertOctagonIcon } from "lucide-react";
import { toast } from "sonner";

export default function RoomTypeDelete({ id, onClose }: { id: string; onClose: () => void }) {
  const form = useForm();

  // Handle delete room type
  function handleDelete(e: React.FormEvent, id: string) {
    e.preventDefault();

    toast.loading("Menghapus tipe kamar...", { id: `delete-${id}` });
    form.delete(route("roomtype.destroy", { id }), {
      onSuccess: () => {
        toast.success("Tipe kamar berhasil dihapus", { id: `delete-${id}` });
        onClose();
      },
      onError: () => toast.error("Tipe kamar gagal dihapus", { id: `delete-${id}` }),
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Hapus Tipe Kamar</DialogTitle>
        <DialogDescription>Apakah anda yakin ingin menghapus tipe kamar ini?</DialogDescription>
      </DialogHeader>
      <Alert variant="destructive">
        <AlertOctagonIcon className="size-4" />
        <AlertTitle>Peringatan</AlertTitle>
        <AlertDescription>Data Kamar yang berkaitan tidak akan memiliki Tipe Kamar</AlertDescription>
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
