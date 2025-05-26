import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { AlertOctagonIcon } from "lucide-react";
import { toast } from "sonner";

export default function RoleDelete(props: { id: string; onClose: () => void }) {
  const { id, onClose } = props;

  const form = useForm();

  // Handle delete room type
  function handleDelete(e: React.FormEvent, id: string) {
    e.preventDefault();

    toast.loading("Menghapus role...", { id: `delete-role-${id}` });

    form.delete(route("role.destroy", { id }), {
      onSuccess: () => {
        toast.success("Role berhasil dihapus", { id: `delete-role-${id}` });
        onClose();
      },
      onError: () => toast.error("Role gagal dihapus", { id: `delete-role-${id}` }),
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Hapus Role</DialogTitle>
        <DialogDescription>Apakah anda yakin ingin menghapus role ini?</DialogDescription>
      </DialogHeader>
      <Alert variant="destructive">
        <AlertOctagonIcon className="size-4" />
        <AlertTitle>Peringatan</AlertTitle>
        <AlertDescription>Data User yang berkaitan tidak akan memiliki Role</AlertDescription>
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
