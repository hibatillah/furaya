import InputError from "@/components/input-error";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "sonner";

export default function DepartmentCreate() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, setData, post, errors, reset, processing } = useForm<Department.Create>();

  // handle create room type
  function handleCreateDepartment(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Membuat departemen...", {
      id: "create-department",
    });

    post(route("department.store"), {
      onSuccess: () => {
        reset();
        setDialogOpen(false);
        toast.success("Departemen berhasil ditambahkan", {
          id: "create-department",
        });
      },
      onError: (error) => {
        toast.error("Departemen gagal ditambahkan", {
          id: "create-department",
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
        <Button className="ms-auto w-fit">Tambah Departemen</Button>
      </DialogTrigger>
      <DialogContent className="w-100">
        <DialogHeader>
          <DialogTitle>Tambah Departemen</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleCreateDepartment}
          className="max-w-lg space-y-6"
        >
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
            loadingText="Membuat departemen..."
            className="w-full"
          >
            Tambah
          </SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
