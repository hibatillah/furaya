import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { AlertOctagonIcon } from "lucide-react";
import { toast } from "sonner";

export default function RoomDelete(props: { id: string; onClose: () => void }) {
  const { id, onClose } = props;
  const form = useForm();

  // Handle delete room
  function handleDelete(e: React.FormEvent, id: string) {
    e.preventDefault();

    toast.loading("Menghapus kamar...", { id: `delete-room-${id}` });

    form.delete(route("room.destroy", { id }), {
      onSuccess: () => {
        toast.success("Kamar berhasil dihapus", { id: `delete-room-${id}` });
        onClose();
      },
      onError: () => toast.error("Kamar gagal dihapus", { id: `delete-room-${id}` }),
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Hapus Kamar</DialogTitle>
        <DialogDescription>Apakah anda yakin ingin menghapus kamar ini?</DialogDescription>
      </DialogHeader>
      <Alert variant="destructive">
        <AlertOctagonIcon className="size-4" />
        <AlertTitle>Peringatan</AlertTitle>
        <AlertDescription>Data Kamar yang ....</AlertDescription>
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
