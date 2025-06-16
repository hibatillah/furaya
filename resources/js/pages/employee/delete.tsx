import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function EmployeeDelete(props: { employee: Employee.Default; onClose: () => void }) {
  const { employee, onClose } = props;

  const form = useForm();

  // Handle delete employee
  function handleDelete(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Menghapus karyawan...", { id: `delete-employee-${employee.id}` });

    form.delete(route("employee.destroy", { id: employee.id }), {
      onSuccess: () => {
        toast.success("Karyawan berhasil dihapus", {
          id: `delete-employee-${employee.id}`,
        });
      },
      onError: (error) =>
        toast.error("Karyawan gagal dihapus", {
          id: `delete-employee-${employee.id}`,
          description: error.message,
        }),
      onFinish: () => onClose(),
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Hapus Karyawan</DialogTitle>
        <DialogDescription>Apakah anda yakin ingin menghapus karyawan ini?</DialogDescription>
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
        <form onSubmit={handleDelete}>
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
