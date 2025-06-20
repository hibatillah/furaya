import { InputDate } from "@/components/input-date";
import InputError from "@/components/input-error";
import { InputTime } from "@/components/input-time";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@inertiajs/react";
import { getDate, getMonth, getYear, isAfter, set } from "date-fns";
import { toast } from "sonner";

export default function CheckOut(props: { data: Reservation.Default; employee: Employee.Default; onClose: () => void }) {
  const { data: reservation, employee, onClose } = props;

  // initial data
  const initialDate = set(new Date(reservation.end_date as Date), {
    hours: 12,
    minutes: 0,
  });

  const canCheckIn = isAfter(new Date(), initialDate);
  const canCheckOut = canCheckIn && reservation.check_in?.checked_in_at;

  // declare form
  const { data, setData, post, errors, processing } = useForm<CheckOut.Create>({
    checked_out_at: initialDate,
    check_out_by: employee.user?.name || "",
    notes: "",
    employee_id: employee.id,
    reservation_id: reservation.id,
    final_total: reservation.total_price,
  });

  // Handle check out
  function handleCheckOut(e: React.FormEvent) {
    e.preventDefault();

    if (!canCheckOut) return;

    // sent data
    toast.loading("Menambahkan data check-out...", {
      id: `check-out-${reservation.id}`,
    });

    post(route("checkout.store", { reservationId: reservation.id }), {
      onSuccess: () => {
        toast.success("Check-out berhasil ditambahkan", {
          id: `check-out-${reservation.id}`,
        });
        onClose();
      },
      onError: (error) =>
        toast.error("Check-out gagal ditambahkan", {
          id: `check-out-${reservation.id}`,
          description: error.message,
        }),
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Check Out Reservasi</DialogTitle>
        <DialogDescription>Check-out untuk reservasi {reservation.booking_number}</DialogDescription>
        {!canCheckOut && (
          <Alert>
            <AlertTitle>Belum Waktu Check Out</AlertTitle>
            <AlertDescription>Check-in dahulu sebelum dapat melakukan check-out.</AlertDescription>
          </Alert>
        )}
      </DialogHeader>
      <form
        onSubmit={handleCheckOut}
        className="grid max-w-lg grid-cols-2 gap-4"
      >
        {/* date */}
        <div className="grid gap-2">
          <Label htmlFor="date">Tanggal</Label>
          <InputDate
            mode="single"
            value={data.checked_out_at as Date}
            onChange={(value) => {
              const date = getDate(value as Date);
              const month = getMonth(value as Date);
              const year = getYear(value as Date);

              setData(
                "checked_out_at",
                set(new Date(year, month, date), {
                  hours: 14,
                  minutes: 0,
                }),
              );
            }}
            className="w-full"
            disabledDate={{ before: new Date(reservation.start_date) }}
          />
          <InputError message={errors.checked_out_at} />
        </div>

        {/* time */}
        <div className="grid gap-2">
          <Label htmlFor="time">Waktu</Label>
          <InputTime
            id="time"
            className="bg-inherit"
            defaultValue="12:00:00"
            onChange={(e) => {
              const [hours, minutes] = e.target.value.split(":");

              setData(
                "checked_out_at",
                set(data.checked_out_at as Date, {
                  hours: parseInt(hours),
                  minutes: parseInt(minutes),
                }),
              );
            }}
            required
          />
          <InputError message={errors.checked_out_at} />
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
            disabled={processing || !canCheckIn}
          >
            Submit Check Out
          </Button>
        </div>
      </form>
    </>
  );
}
