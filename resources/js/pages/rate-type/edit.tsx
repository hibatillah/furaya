import InputError from "@/components/input-error";
import { SubmitButton } from "@/components/submit-button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function RateTypeEdit(props: { data: RateType.Default; onClose: () => void }) {
  const { data: rateTypeData, onClose } = props;

  const { data, setData, put, errors, processing } = useForm<RateType.Update>(rateTypeData);

  // handle edit rate type
  function handleEditRateType(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Mengubah tipe tarif...", {
      id: `edit-rate-type-${data.id}`,
    });

    put(route("rate.type.update", { id: data.id }), {
      onSuccess: () => {
        onClose();
        toast.success("Tipe tarif berhasil diubah", {
          id: `edit-rate-type-${data.id}`,
        });
      },
      onError: (error) => {
        toast.error("Tipe tarif gagal diubah", {
          id: `edit-rate-type-${data.id}`,
          description: error.message,
        });
      },
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Ubah Tipe Tarif</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={handleEditRateType}
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
            autoComplete="off"
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
            autoComplete="off"
            required
          />
          <InputError message={errors.name} />
        </div>

        {/* rate */}
        <div className="grid gap-2">
          <Label htmlFor="rate">Tarif</Label>
          <div className="relative">
            <Input
              id="rate"
              type="number"
              value={data.rate}
              placeholder="Tarif"
              onChange={(e) => setData("rate", Number(e.target.value))}
              className="w-full ps-9"
              disableHandle
              autoComplete="off"
              required
            />
            <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-1 flex items-center px-2 text-sm select-none">
              Rp
            </span>
          </div>
          <InputError message={errors.rate} />
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
