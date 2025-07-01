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

export default function NationalityCreate() {
  const { auth } = usePage<SharedData>().props;
  const userId = auth.user?.id;

  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, setData, post, errors, reset, processing } = useForm<Nationality.Create>({
    code: "",
    name: "",
    created_by: userId,
  });

  // handle create nationality
  function handleCreateNationality(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Membuat kewarganegaraan...", {
      id: "create-nationality",
    });

    post(route("nationality.store"), {
      onSuccess: () => {
        reset();
        setDialogOpen(false);
        toast.success("Kewarganegaraan berhasil ditambahkan", {
          id: "create-nationality",
        });
      },
      onError: (error) => {
        console.log(error);
        toast.error("Kewarganegaraan gagal ditambahkan", {
          id: "create-nationality",
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
        <Button className="ms-auto w-fit">Tambah Kewarganegaraan</Button>
      </DialogTrigger>
      <DialogContent className="w-120">
        <DialogHeader>
          <DialogTitle>Tambah Kewarganegaraan</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleCreateNationality}
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
