import { DataList } from "@/components/data-list";
import { InputDate } from "@/components/input-date";
import InputError from "@/components/input-error";
import { InputTime } from "@/components/input-time";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, getTimeFormat } from "@/lib/utils";
import { dateConfig } from "@/static";
import { useForm } from "@inertiajs/react";
import { set } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function EditCheckOut(props: { data: Reservation.Default; onClose: () => void }) {
  const { data: reservation, onClose } = props;

  // declare form
  const checkOutDatetime = new Date(reservation.check_out?.check_out_at as Date);
  const checkOutTime = getTimeFormat(checkOutDatetime);

  const [date, setDate] = useState<Date>(checkOutDatetime);
  const [time, setTime] = useState<string>(checkOutTime);
  const [additionalCharge, setAdditionalCharge] = useState<number | "">(""); // handle empty input for useForm inertia\

  const { data, setData, put, errors, processing } = useForm<CheckOut.Update>({
    id: reservation.check_out?.id,
    check_out_at: reservation.check_out?.check_out_at,
    check_out_by: reservation.check_out?.check_out_by,
    notes: reservation.check_out?.notes,
    employee_id: reservation.check_out?.employee_id,
    reservation_id: reservation.id,
    additional_charge: reservation.check_out?.additional_charge,
  });

  // handle time change
  useEffect(() => {
    const [hours, minutes, seconds] = time.split(":");
    const formatted = set(
      date,
      {
        hours: parseInt(hours),
        minutes: parseInt(minutes),
        seconds: parseInt(seconds),
      },
      dateConfig,
    );

    setData("check_out_at", formatted);
  }, [date, time]);

  // Handle check out
  function handleUpdateCheckOut(e: React.FormEvent) {
    e.preventDefault();

    // sent data
    toast.loading("Mengubah data check-out...", {
      id: `check-out-${reservation.id}`,
    });

    put(route("checkout.update", { id: data.id }), {
      onSuccess: () => {
        toast.success("Check-out berhasil diubah", {
          id: `check-out-${reservation.id}`,
        });
        onClose();
      },
      onError: (error) => {
        toast.error("Check-out gagal diubah", {
          id: `check-out-${reservation.id}`,
          description: error.message,
        });
      },
    });
  }

  // define data list
  const finalPrice = useMemo(() => {
    const totalPrice = Number(reservation.total_price);
    return additionalCharge ? totalPrice + additionalCharge : totalPrice;
  }, [reservation.total_price, additionalCharge]);

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
      label: "Biaya Awal",
      value: formatCurrency(Number(reservation.total_price)),
    },
    {
      label: "Biaya Tambahan",
      value: additionalCharge ? formatCurrency(Number(additionalCharge)) : "-",
    },
    {
      label: "Total Harga",
      value: formatCurrency(finalPrice),
    },
  ];

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Check Out</DialogTitle>
        <div className="mt-2 text-sm">
          <DataList
            data={dataList.slice(0, -1)}
            className="gap-y-1.5"
          />
          <Separator className="my-2" />
          <DataList
            data={dataList.slice(-1)}
            className="gap-x-[65px]"
          />
          <Separator className="mt-2 mb-1" />
        </div>
      </DialogHeader>
      <form
        onSubmit={handleUpdateCheckOut}
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
            defaultMonth={date}
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
            required
          />
        </div>

        {/* check out at error message */}
        <InputError
          message={errors.check_out_at}
          className="col-span-2"
        />

        {/* additional charge */}
        <div className="col-span-2 flex flex-col gap-2">
          <Label htmlFor="additional_charge">Biaya Tambahan</Label>
          <div className="relative">
            <Input
              id="additional_charge"
              type="number"
              value={additionalCharge}
              onChange={(e) => {
                setAdditionalCharge(Number(e.target.value));
                setData("additional_charge", Number(e.target.value));
              }}
              className="w-full ps-8"
              disableHandle
            />
            <span className="text-muted-foreground absolute inset-y-0 start-0 flex items-center px-2 text-sm">Rp</span>
          </div>
          <InputError message={errors.additional_charge} />
        </div>

        {/* notes */}
        <div className="col-span-2 flex flex-col gap-2">
          <Label
            htmlFor="notes"
            optional
          >
            Catatan
          </Label>
          <Textarea
            id="notes"
            value={data.notes}
            onChange={(e) => setData("notes", e.target.value)}
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
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </>
  );
}
