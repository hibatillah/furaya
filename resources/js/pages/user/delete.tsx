import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function UserDelete({ user_id }: { user_id: string }) {
  const form = useForm();

  // Handle delete employee
  function handleDelete(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Menghapus pengguna...", { id: `delete-user-${user_id}` });

    form.delete(route("user.destroy", { id: user_id }), {
      onSuccess: () => {
        toast.success("Pengguna berhasil dihapus", {
          id: `delete-user-${user_id}`,
        });
      },
      onError: (error) =>
        toast.error("Pengguna gagal dihapus", {
          id: `delete-user-${user_id}`,
          description: error.message,
        }),
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Hapus Pengguna</DialogTitle>
        <DialogDescription>Apakah anda yakin ingin menghapus pengguna ini?</DialogDescription>
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
