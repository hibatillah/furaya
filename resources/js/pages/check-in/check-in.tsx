import { DataList } from "@/components/data-list";
import { InputDate } from "@/components/input-date";
import InputError from "@/components/input-error";
import { InputTime } from "@/components/input-time";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatCurrency } from "@/lib/utils";
import { transactionStatusBadgeColor } from "@/static/reservation";
import { Link, useForm } from "@inertiajs/react";
import { isAfter, set } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CheckIn(props: { data: Reservation.Default; employee: Employee.Default; status: Enum.RoomStatus[]; onClose: () => void }) {
  const { data: reservation, employee, status, onClose } = props;

  // define data list
  const dataList = [
    {
      label: "No. Booking",
      value: reservation.booking_number,
    },
    {
      label: "Nama Tamu",
      value: reservation.reservation_guest?.name,
    },
    {
      label: "Total Harga",
      value: formatCurrency(Number(reservation.total_price)),
    },
    {
      label: "Status Pembayaran",
      value: (
        <Badge
          variant="outline"
          className={cn("capitalize", transactionStatusBadgeColor[reservation.transaction_status as keyof typeof transactionStatusBadgeColor])}
        >
          {reservation.transaction_status}
        </Badge>
      ),
    },
  ];

  // initial data
  const initialDate = set(new Date(reservation.start_date), {
    hours: 14,
    minutes: 0,
  });

  const canCheckIn = isAfter(new Date(), initialDate);
  const isPending = reservation.status_acc === "pending";

  // declare form
  const [date, setDate] = useState<Date>(initialDate);
  const [time, setTime] = useState<string>("14:00:00");
  const { data, setData, post, errors, processing } = useForm<CheckIn.Create>({
    check_in_at: initialDate,
    check_in_by: employee.user?.name || "",
    notes: "",
    room_status: "Check In" as Enum.RoomStatus, // default room status after check-in
    employee_id: employee.id,
    reservation_id: reservation.id,
  });

  // handle time change
  useEffect(() => {
    const [hours, minutes, seconds] = time.split(":");
    const formatted = set(date, {
      hours: parseInt(hours),
      minutes: parseInt(minutes),
      seconds: parseInt(seconds),
    });

    setData("check_in_at", new Date(formatted).toISOString());
  }, [date, time]);

  // Handle check in
  function handleCheckIn(e: React.FormEvent) {
    e.preventDefault();

    if (!canCheckIn) {
      toast.warning("Tidak dapat melakukan Check-in", {
        description: "Belum memasuki waktu reservasi.",
      });
      return;
    }

    // sent data
    toast.loading("Menambahkan data check-in...", {
      id: `check-in-${reservation.id}`,
    });

    post(route("checkin.store", { reservationId: reservation.id }), {
      onSuccess: () => {
        toast.success("Check-in berhasil ditambahkan", {
          id: `check-in-${reservation.id}`,
        });
        onClose();
      },
      onError: () => {
        toast.error("Check-in gagal ditambahkan", {
          id: `check-in-${reservation.id}`,
        });
      },
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Check In Reservasi</DialogTitle>
        {canCheckIn && !isPending ? (
          <>
            <div className="mt-2 text-sm">
              <DataList
                data={dataList}
                className="gap-y-1.5"
              />
            </div>
            <Separator className="my-1" />
          </>
        ) : isPending ? (
          <Alert>
            <AlertTitle>Lengkapi Data Reservasi</AlertTitle>
            <AlertDescription>Check-in dapat dilakukan setelah data reservasi lengkap.</AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <AlertTitle>Belum Waktu Check In</AlertTitle>
            <AlertDescription>Check-in belum dapat dilakukan karena belum memasuki waktu reservasi.</AlertDescription>
          </Alert>
        )}
      </DialogHeader>
      <form
        onSubmit={handleCheckIn}
        className="grid max-w-lg grid-cols-2 gap-4"
      >
        {/* date */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="date"
            required
          >
            Tanggal
          </Label>
          <InputDate
            mode="single"
            value={date}
            onChange={(value) => setDate(value as Date)}
            className="w-full"
            disabledDate={{
              before: new Date(reservation.start_date),
              after: new Date(reservation.end_date as Date),
            }}
            disabled={isPending}
          />
        </div>

        {/* time */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="time"
            required
          >
            Waktu
          </Label>
          <InputTime
            id="time"
            className="bg-accent"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={isPending}
            required
          />
        </div>

        {/* check in at error message */}
        <InputError message={errors.check_in_at} className="col-span-2" />

        {/* notes */}
        <div className="col-span-2 flex flex-col gap-2">
          <Label htmlFor="notes">Catatan</Label>
          <Textarea
            id="notes"
            value={data.notes}
            onChange={(e) => setData("notes", e.target.value)}
            placeholder="Catatan check-in (opsional)"
            className="min-h-24"
            disabled={isPending}
          />
          <InputError message={errors.notes} />
        </div>

        {/* submit button */}
        <div className="col-span-2 grid gap-3 lg:grid-cols-2">
          {!isPending ? (
            <>
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
            </>
          ) : (
            <Button
              type="button"
              className="col-span-full"
              asChild
            >
              <Link href={route("reservation.edit", { id: reservation.id })}>Update Reservasi</Link>
            </Button>
          )}
        </div>
      </form>
    </>
  );
}
