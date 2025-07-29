import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function CheckInCreate(props: { reservationId: string; onClose: () => void }) {
  const { reservationId, onClose } = props;

  // declare form
  const { data, setData, post, errors, processing } = useForm<CheckIn.Create>();

  // Handle check in
  function handleCheckIn(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Menambahkan data check-in...", {
      id: `check-in-${reservationId}`,
    });

    post(route("check-in.store", { reservationId }), {
      onSuccess: () => {
        onClose();
        toast.success("Check-in berhasil ditambahkan", {
          id: `check-in-${reservationId}`,
        });
      },
      onError: (error) =>
        toast.error("Check-in gagal ditambahkan", {
          id: `check-in-${reservationId}`,
          description: error.message,
        }),
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Tambah Check In</DialogTitle>
        <DialogDescription>Isi data check-in untuk reservasi</DialogDescription>
      </DialogHeader>
      <form
        onSubmit={handleCheckIn}
        className="grid max-w-lg grid-cols-2 gap-4"
      >
        {/* date */}
        <div className="grid gap-2">
          <Label htmlFor="date">Tanggal</Label>
          <Input
            id="date"
            type="text"
            value={data.check_in_at.toLocaleString()}
            onChange={(e) => setData("check_in_at", new Date(e.target.value))}
            placeholder="Tanggal check-in"
            required
          />
          <InputError message={errors.check_in_at} />
        </div>

        {/* time */}
        <div className="grid gap-2">
          <Label htmlFor="time">Waktu</Label>
          <Input
            id="time"
            type="text"
            value={data.check_in_at.toLocaleString()}
            onChange={(e) => setData("check_in_at", new Date(e.target.value))}
            placeholder="Tanggal check-in"
            required
          />
          <InputError message={errors.check_in_at} />
        </div>

        {/* notes */}
        <div className="col-span-2 grid gap-2">
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
        <div className="col-span-2 grid gap-3 lg:grid-cols-2">
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
            Submit Check In
          </Button>
        </div>
      </form>
    </>
  );
}
