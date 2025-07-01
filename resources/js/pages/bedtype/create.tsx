import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { useState } from "react";

export default function BedTypeCreate() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, setData, post, errors, processing } = useForm<BedType.Create>();

  // handle create bed type
  function handleCreateBedType(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Membuat tipe kasur...", {
      id: "create-bed-type",
    });

    post(route("bedtype.store"), {
      onSuccess: () => {
        setDialogOpen(false);
        toast.success("Tipe kasur berhasil ditambahkan", {
          id: "create-bed-type",
        });
      },
      onError: (error) => {
        toast.error("Tipe kasur gagal ditambahkan", {
          id: "create-bed-type",
          description: error.message,
        });
      },
    });
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="ms-auto w-fit">Tambah Tipe Kasur</Button>
      </DialogTrigger>
      <DialogContent className="w-120">
        <DialogHeader>
          <DialogTitle>Tambah Tipe Kasur</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleCreateBedType}
          className="max-w-lg space-y-6"
        >
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

          <Button
            type="submit"
            disabled={processing}
            className="w-full"
          >
            Tambah
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
