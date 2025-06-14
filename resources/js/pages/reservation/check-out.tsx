import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function CheckOut(props: { reservationId: string; onClose: () => void }) {
  const { reservationId, onClose } = props;

  // declare form
  const { data, setData, post, errors, processing } = useForm<CheckOut.Create>();

  // Handle check out
  function handleCheckOut(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Menambahkan data check-out...", { id: `check-out-${reservationId}` });

    post(route("check-out.store", { reservationId }), {
      onSuccess: () => {
        toast.success("Check-out berhasil ditambahkan", { id: `check-out-${reservationId}` });
        onClose();
      },
      onError: (error) =>
        toast.error("Check-out gagal ditambahkan", {
          id: `check-out-${reservationId}`,
          description: error.message,
        }),
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Tambah Check Out</DialogTitle>
        <DialogDescription>Isi data check-out untuk reservasi</DialogDescription>
      </DialogHeader>
      <form
        onSubmit={handleCheckOut}
        className="grid max-w-lg grid-cols-2 gap-4"
      >
        {/* date */}
        <div className="grid gap-2">
          <Label htmlFor="date">Tanggal</Label>
          <Input
            id="date"
            type="text"
            value={data.checked_out_at.toLocaleString()}
            onChange={(e) => setData("checked_out_at", new Date(e.target.value))}
            placeholder="Tanggal check-out"
            required
          />
          <InputError message={errors.checked_out_at} />
        </div>

        {/* time */}
        <div className="grid gap-2">
          <Label htmlFor="time">Waktu</Label>
          <Input
            id="time"
            type="text"
            value={data.checked_out_at.toLocaleString()}
            onChange={(e) => setData("checked_out_at", new Date(e.target.value))}
            placeholder="Tanggal check-out"
            required
          />
          <InputError message={errors.checked_out_at} />
        </div>

        {/* notes */}
        <div className="grid col-span-2 gap-2">
          <Label htmlFor="notes">Catatan</Label>
          <Textarea
            id="notes"
            value={data.notes}
            onChange={(e) => setData("notes", e.target.value)}
            placeholder="Tambah catatan"
          />
          <InputError message={errors.notes} />
        </div>

        {/* submit button */}
        <div className="grid gap-3 col-span-2 lg:grid-cols-2">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={processing}
          >
            Submit Check Out
          </Button>
        </div>
      </form>
    </>
  );
}
