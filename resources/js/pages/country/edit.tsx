import InputError from "@/components/input-error";
import { SubmitButton } from "@/components/submit-button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function CountryEdit(props: { data: Country.Default; onClose: () => void }) {
  const { data: countryData, onClose } = props;

  const { data, setData, put, errors, processing } = useForm<Country.Update>(countryData);

  // handle edit country
  function handleEditCountry(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Mengubah negara...", {
      id: `edit-country-${data.id}`,
    });

    put(route("country.update", { id: data.id }), {
      onSuccess: () => {
        onClose();
        toast.success("Negara berhasil diubah", {
          id: `edit-country-${data.id}`,
        });
      },
      onError: (error) => {
        toast.error("Negara gagal diubah", {
          id: `edit-country-${data.id}`,
          description: error.message,
        });
      },
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Ubah Negara</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={handleEditCountry}
        className="max-w-lg space-y-6"
      >
        {/* code */}
        <div className="grid gap-2">
          <Label htmlFor="code" required>Kode</Label>
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
          <Label htmlFor="name" required>Nama</Label>
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
