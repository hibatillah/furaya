import InputError from "@/components/input-error";
import { SubmitButton } from "@/components/submit-button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function GuestTypeEdit(props: { data: GuestType.Default; onClose: () => void }) {
  const { data: guestTypeData, onClose } = props;

  const { data, setData, put, errors, processing } = useForm<GuestType.Update>(guestTypeData);

  // handle edit guest type
  function handleEditGuestType(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Mengubah tipe tamu...", {
      id: `edit-guest-type-${data.id}`,
    });

    put(route("guest.type.update", { id: data.id }), {
      onSuccess: () => {
        onClose();
        toast.success("Tipe tamu berhasil diubah", {
          id: `edit-guest-type-${data.id}`,
        });
      },
      onError: (error) => {
        toast.error("Tipe tamu gagal diubah", {
          id: `edit-guest-type-${data.id}`,
          description: error.message,
        });
      },
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Ubah Tipe Tamu</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={handleEditGuestType}
        className="max-w-lg space-y-6"
      >
        {/* code */}
        <div className="grid gap-2">
          <Label htmlFor="code">Kode</Label>
          <Input
            id="code"
            type="text"
            value={data.code}
            placeholder="Kode"
            onChange={(e) => setData("code", e.target.value)}
            required
          />
          <InputError message={errors.code} />
        </div>

        {/* name */}
        <div className="grid gap-2">
          <Label htmlFor="name">Nama</Label>
          <Input
            id="name"
            type="text"
            value={data.name}
            placeholder="Nama"
            onChange={(e) => setData("name", e.target.value)}
            required
          />
          <InputError message={errors.name} />
        </div>

        <SubmitButton
          disabled={processing}
          loading={processing}
          loadingText="Memperbarui..."
          className="w-full"
        >
          Perbarui
        </SubmitButton>
      </form>
    </>
  );
}
