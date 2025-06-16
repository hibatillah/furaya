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

export default function GeographyCreate() {
  const { auth } = usePage<SharedData>().props;
  const userId = auth.user?.id;

  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, setData, post, errors, reset, processing } = useForm<Geography.Create>({
    code: "",
    name: "",
    created_by: userId,
  });

  // handle create geography
  function handleCreateGeography(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Membuat geografi...", {
      id: "create-geography",
    });

    post(route("geography.store"), {
      onSuccess: () => {
        reset();
        setDialogOpen(false);
        toast.success("Geografi berhasil ditambahkan", {
          id: "create-geography",
        });
      },
      onError: (error) => {
        console.log(error);
        toast.error("Geografi gagal ditambahkan", {
          id: "create-geography",
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
        <Button className="ms-auto w-fit">Tambah Geografi</Button>
      </DialogTrigger>
      <DialogContent className="w-120">
        <DialogHeader>
          <DialogTitle>Tambah Geografi</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleCreateGeography}
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
