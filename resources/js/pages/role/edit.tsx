import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

export default function RoleEdit(props: { data: Role.Default, onClose: () => void }) {
  const { data: dataRole, onClose } = props;

  const { data, setData, put, processing, errors } = useForm<Role.Update>(dataRole);

  // handle update role data
  function handleUpdateRole(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Memperbarui role...", {
      id: `update-role-${data.id}`,
    });

    put(route("role.update", { id: data.id }), {
      onSuccess: () => {
        toast.success("Role berhasil diperbarui", {
          id: `update-role-${data.id}`,
        });
        onClose();
      },
      onError: () => {
        toast.error("Role gagal diperbarui", {
          id: `update-role-${data.id}`,
        });
      },
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Role</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={handleUpdateRole}
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
            variant="outline"
            type="button"
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={processing}
          >
            Perbarui
          </Button>
        </div>
      </form>
    </>
  );
}
