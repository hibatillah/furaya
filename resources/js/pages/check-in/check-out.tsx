import { DataList } from "@/components/data-list";
import { InputDate } from "@/components/input-date";
import InputError from "@/components/input-error";
import { InputTime } from "@/components/input-time";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@inertiajs/react";
import { isAfter, set } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CheckOut(props: { data: Reservation.Default; employee: Employee.Default; status: Enum.RoomStatus[]; onClose: () => void }) {
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
      label: "No. Kamar",
      value: reservation.reservation_room?.room_number,
    },
  ];

  // initial data
  const initialDate = set(new Date(reservation.end_date as Date), {
    hours: 12,
    minutes: 0,
  });

  const canCheckIn = isAfter(new Date(), initialDate);
  const canCheckOut = canCheckIn && reservation.check_in?.check_in_at;

  // declare form
  const [date, setDate] = useState<Date>(initialDate);
  const [time, setTime] = useState<string>("12:00:00");
  const { data, setData, post, errors, processing } = useForm<CheckOut.Create>({
    check_out_at: initialDate,
    check_out_by: employee.user?.name || "",
    notes: "",
    employee_id: employee.id,
    reservation_id: reservation.id,
    final_total: reservation.total_price,
    room_status: "Check Out" as Enum.RoomStatus,
  });

  // handle time change
  useEffect(() => {
    const [hours, minutes, seconds] = time.split(":");
    const formatted = set(date, {
      hours: parseInt(hours),
      minutes: parseInt(minutes),
      seconds: parseInt(seconds),
    });

    setData("check_out_at", new Date(formatted).toISOString());
  }, [date, time]);

  // Handle check out
  function handleCheckOut(e: React.FormEvent) {
    e.preventDefault();

    if (!canCheckOut) {
      toast.warning("Tidak dapat melakukan Check-out", {
        description: "Lakukan Check-in terlebih dahulu.",
      });
      return;
    }

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
        {canCheckOut ? (
          <>
            <DialogDescription className="mt-2">
              <DataList data={dataList} />
            </DialogDescription>
            <Separator className="my-1" />
          </>
        ) : (
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
            value={date}
            onChange={(value) => setDate(value as Date)}
            className="w-full"
            disabledDate={{
              before: new Date(reservation.start_date),
              after: new Date(reservation.end_date as Date),
            }}
          />
          <InputError message={errors.check_out_at} />
        </div>

        {/* time */}
        <div className="grid gap-2">
          <Label htmlFor="time">Waktu</Label>
          <InputTime
            id="time"
            className="bg-inherit"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        {/* final total */}
        <div className="col-span-2 grid gap-2">
          <Label htmlFor="final_total">Harga Akhir</Label>
          <div className="relative">
            <Input
              id="final_total"
              type="number"
              value={data.final_total}
              onChange={(e) => setData("final_total", Number(e.target.value))}
              placeholder="Input harga akhir"
              className="w-full ps-8"
              disableHandle
            />
            <span className="text-muted-foreground absolute inset-y-0 start-0 flex items-center px-2 text-sm">Rp</span>
          </div>
          <InputError message={errors.final_total} />
        </div>

        {/* room status */}
        <div className="col-span-2 grid gap-2">
          <Label htmlFor="time">Status Kamar</Label>
          <Select
            value={data.room_status}
            onValueChange={(value) => setData("room_status", value as Enum.RoomStatus)}
            required
          >
            <SelectTrigger id="room_status">
              <SelectValue placeholder="Pilih Status Kamar">
                <span className="capitalize">{data.room_status}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {status.map((status) => (
                <SelectItem
                  key={status}
                  value={status}
                  className="capitalize"
                >
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <InputError message={errors.room_status} />
        </div>

        {/* notes */}
        <div className="col-span-2 grid gap-2">
          <Label htmlFor="notes">Catatan</Label>
          <Textarea
            id="notes"
            value={data.notes}
            onChange={(e) => setData("notes", e.target.value)}
            placeholder="Tambah catatan"
            className="min-h-24"
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
            Submit Check Out
          </Button>
        </div>
      </form>
    </>
  );
}
