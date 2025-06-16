import { Button } from "@/components/ui/button";
import { DialogClose, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function CountryDelete(props: { id: string; onClose: () => void }) {
  const { id, onClose } = props;

  const form = useForm();

  // Handle delete country
  function handleDelete(e: React.FormEvent, id: string) {
    e.preventDefault();

    toast.loading("Menghapus negara...", { id: `delete-country-${id}` });
    form.delete(route("country.destroy", { id }), {
      onSuccess: () => {
        toast.success("Negara berhasil dihapus", { id: `delete-country-${id}` });
        onClose();
      },
      onError: (error) =>
        toast.error("Negara gagal dihapus", {
          id: `delete-country-${id}`,
          description: error.message,
        }),
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Hapus Negara</DialogTitle>
        <DialogDescription>Apakah anda yakin ingin menghapus negara ini?</DialogDescription>
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
