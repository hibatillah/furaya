import { DataList } from "@/components/data-list";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import { router, useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function ConfirmPendingReservation({ data, onClose }: { data: Reservation.Default; onClose: () => void }) {
  const dataList = [
    {
      label: "Nama Tamu",
      value: data.reservation_guest?.name,
    },
    {
      label: "Tanggal Reservasi",
      value: `${data.formatted_start_date} - ${data.formatted_end_date}`,
    },
    {
      label: "Tipe Kamar",
      value: `${data.reservation_room?.room_type_name}${data.smoking_type ? ` - ${data.smoking_type}` : ""}`,
    },
    {
      label: "Breakfast",
      value: data.include_breakfast ? "Ya" : "Tidak",
    },
    {
      label: "Pax",
      value: data.pax ? `${data.adults} dewasa, ${data.children} anak` : "-",
    },
    {
      label: "Pembayaran",
      value: data.payment_method,
    },
    {
      label: "Total Harga",
      value: formatCurrency(Number(data.total_price)),
    },
  ];

  const { put } = useForm();

  // handle reject reservation
  function handleRejectReservation() {
    toast.loading("Memperbarui reservasi...", {
      id: "reject-reservation",
    });

    put(route("reservation.reject", { id: data.id }), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        toast.success("Reservasi berhasil ditolak", {
          id: "reject-reservation",
        });
        onClose();
      },
      onError: () => {
        toast.error("Terjadi kesalahan menolak reservasi", {
          id: "reject-reservation",
        });
      },
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Konfirmasi Reservasi</DialogTitle>
      </DialogHeader>
      <DataList data={dataList} />
      <DialogFooter className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={handleRejectReservation}
        >
          Tolak
        </Button>
        <Button
          variant="default"
          onClick={() => {
            router.visit(route("reservation.edit", { id: data.id }));
          }}
        >
          Konfirmasi
        </Button>
      </DialogFooter>
    </>
  );
}
