import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { useState } from "react";

export default function FacilityCreate() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, setData, post, errors, processing, reset } = useForm<Facility.Create>();

  // handle create facility
  function handleCreateFacility(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Membuat fasilitas...", {
      id: "create-facility",
    });

    post(route("facility.store"), {
      onSuccess: () => {
        setDialogOpen(false);
        reset()
        toast.success("Fasilitas berhasil ditambahkan", {
          id: "create-facility",
        });
      },
      onError: (error) => {
        toast.error("Fasilitas gagal ditambahkan", {
          id: "create-facility",
          description: error.message,
        });
      },
    });
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="ms-auto w-fit">Tambah Fasilitas</Button>
      </DialogTrigger>
      <DialogContent className="w-120">
        <DialogHeader>
          <DialogTitle>Tambah Fasilitas</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleCreateFacility}
          className="max-w-lg space-y-6"
        >
          <div className="grid gap-2">
            <Label htmlFor="name" required>Nama</Label>
            <Input
              id="name"
              type="text"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              required
            />
            <InputError message={errors.name} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
            />
            <InputError message={errors.description} />
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
