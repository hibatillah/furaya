import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "sonner";

export default function DepartmentCreate() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, setData, post, errors, processing } = useForm<Department.Create>();

  // handle create room type
  function handleCreateDepartment(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Membuat departemen...", {
      id: "create-department",
    });

    post(route("department.store"), {
      onSuccess: () => {
        setDialogOpen(false);
        toast.success("Departemen berhasil ditambahkan", {
          id: "create-department",
        });
      },
      onError: () => {
        toast.error("Departemen gagal ditambahkan", {
          id: "create-department",
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
      <DialogContent className="w-120">
        <DialogHeader>
          <DialogTitle>Tambah Role</DialogTitle>
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
