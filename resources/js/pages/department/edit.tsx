import InputError from "@/components/input-error";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function DepartmentEdit(props: { data: Department.Default; onClose: () => void }) {
  const { data: dataDepartment, onClose } = props;

  const { data, setData, put, errors, processing } = useForm<Department.Update>(dataDepartment);

  function handleUpdateDepartment(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Memperbarui departemen...", {
      id: `update-department-${data.id}`,
    });

    put(route("department.update", { id: data.id }), {
      onSuccess: () => {
        toast.success("Departemen berhasil diperbarui", {
          id: `update-department-${data.id}`,
        });
        onClose();
      },
      onError: (error) => {
        toast.error("Departemen gagal diperbarui", {
          id: `update-department-${data.id}`,
          description: error.message,
        });
      },
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Departemen</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={handleUpdateDepartment}
        className="max-w-lg space-y-6"
      >
        <div className="grid gap-2">
          <Label htmlFor="name">Nama</Label>
          <Input
            id="name"
            type="text"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            required
            placeholder="Nama"
          />
          <InputError message={errors.name} />
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
          >
            Batal
          </Button>
          <SubmitButton
            disabled={processing}
            loading={processing}
            loadingText="Memperbarui..."
            className="w-full"
          >
            Perbarui
          </SubmitButton>
        </div>
      </form>
    </>
  );
}
