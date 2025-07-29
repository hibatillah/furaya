import InputError from "@/components/input-error";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SharedData } from "@/types";
import { useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "sonner";

export default function RateTypeCreate() {
  const { auth } = usePage<SharedData>().props;
  const userId = auth.user?.id;

  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, setData, post, errors, reset, processing } = useForm<RateType.Create>({
    code: "",
    name: "",
    rate: "",
  });

  // handle create rate type
  function handleCreateRateType(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Membuat tipe tarif...", {
      id: "create-rate-type",
    });

    post(route("rate.type.store"), {
      onSuccess: () => {
        reset();
        setDialogOpen(false);
        toast.success("Tipe tarif berhasil ditambahkan", {
          id: "create-rate-type",
        });
      },
      onError: (error) => {
        toast.error("Tipe tarif gagal ditambahkan", {
          id: "create-rate-type",
          description: error.message,
        });
      },
    });
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
    >
      <DialogTrigger asChild>
        <Button className="ms-auto w-fit">Tambah Tipe Tarif</Button>
      </DialogTrigger>
      <DialogContent className="w-120">
        <DialogHeader>
          <DialogTitle>Tambah Tipe Tarif</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleCreateRateType}
          className="max-w-lg space-y-6"
        >
          {/* code */}
          <div className="grid gap-2">
            <Label htmlFor="code" required>Kode</Label>
            <Input
              id="code"
              type="text"
              value={data.code}
              onChange={(e) => setData("code", e.target.value)}
              autoComplete="off"
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
              onChange={(e) => setData("name", e.target.value)}
              autoComplete="off"
              required
            />
            <InputError message={errors.name} />
          </div>

          {/* rate */}
          <div className="grid gap-2">
            <Label htmlFor="rate" required>Tarif</Label>
            <div className="relative">
              <Input
                id="rate"
                type="number"
                value={data.rate}
                onChange={(e) => setData("rate", Number(e.target.value))}
                className="w-full ps-9"
                autoComplete="off"
                disableHandle
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
            loadingText="Menambahkan..."
            className="w-full"
          >
            Tambah
          </SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
