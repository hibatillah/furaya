import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { AlertOctagonIcon } from "lucide-react";
import { toast } from "sonner";

export default function DepartmentDelete(props: { id: string; canDelete: boolean; onClose: () => void }) {
  const { id, canDelete, onClose } = props;

  const form = useForm();

  // Handle delete room type
  function handleDelete(e: React.FormEvent, id: string) {
    e.preventDefault();

    if (!canDelete) {
      toast.warning("Departemen memiliki karyawan", {
        id: `delete-department-${id}`,
        description: "Kosongkan departemen dari karyawan",
      });
      return;
    }

    toast.loading("Menghapus departemen...", { id: `delete-department-${id}` });

    form.delete(route("department.destroy", { id }), {
      onSuccess: () => {
        onClose();
        toast.success("Departemen berhasil dihapus", {
          id: `delete-department-${id}`,
        });
      },
      onError: () =>
        toast.error("Departemen gagal dihapus", {
          id: `delete-department-${id}`,
        }),
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Hapus Departemen</DialogTitle>
        <DialogDescription>Apakah anda yakin ingin menghapus departemen ini?</DialogDescription>
      </DialogHeader>
      {!canDelete && (
        <Alert variant="destructive">
          <AlertOctagonIcon className="size-4" />
          <AlertTitle>Peringatan</AlertTitle>
          <AlertDescription>Departemen hanya bisa dihapus jika tidak ada karyawan yang berkaitan dengan departemen ini</AlertDescription>
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
