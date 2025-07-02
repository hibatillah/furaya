import { DataList } from "@/components/data-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import AppLayout from "@/layouts/app-layout";
import { cn, formatCurrency } from "@/lib/utils";
import { bookingTypeBadgeColor, reservationStatusBadgeColor, statusAccBadgeColor, visitPurposeBadgeColor } from "@/static/reservation";
import { smokingTypeBadgeColor } from "@/static/room";
import { BreadcrumbItem, SharedData } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import ConfirmPendingReservation from "./confirm";

export default function ReservationsShow(props: { reservation: Reservation.Default; status: Enum.ReservationStatus[] }) {
  const { reservation, status } = props;
  console.log(reservation);

  const { auth } = usePage<SharedData>().props;
  const isEmployee = auth.user.role === "employee";
  const isPending = reservation.status_acc === "pending";

  // handle dialog form
  const [dialogOpen, setDialogOpen] = useState(false);

  // define page breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Reservasi",
      href: route("reservation.index"),
    },
    {
      title: "Detail",
      href: route("reservation.show", { id: reservation.id }),
    },
  ];

  // define data list
  const room = reservation.reservation_room;
  const guest = reservation.reservation_guest;

  const reservationDetails = [
    {
      label: "Nomor Reservasi",
      value: reservation.booking_number,
    },
    {
      label: "Lama Menginap",
      value: `${reservation.length_of_stay} hari`,
    },
    {
      label: "Tanggal Mulai",
      value: reservation.formatted_start_date,
    },
    {
      label: "Tanggal Selesai",
      value: reservation.formatted_end_date,
    },
    {
      label: "Asal Kedatangan",
      value: reservation.arrival_from,
    },
    {
      label: "Pax",
      value: `${reservation.pax} orang`,
    },
    {
      label: "Dewasa",
      value: `${reservation.adults} orang`,
    },
    {
      label: "Anak",
      value: reservation.children ? `${reservation.children} anak` : "-",
    },
    {
      label: "Remarks",
      value: reservation.remarks,
    },
    {
      label: "Tipe Reservasi",
      value: (
        <Badge
          variant="outline"
          className={cn("capitalize", bookingTypeBadgeColor[reservation.booking_type])}
        >
          {reservation.booking_type}
        </Badge>
      ),
    },
    {
      label: "Tujuan Kedatangan",
      value: (
        <Badge
          variant="outline"
          className={cn("capitalize", visitPurposeBadgeColor[reservation.visit_purpose])}
        >
          {reservation.visit_purpose}
        </Badge>
      ),
    },
    {
      label: "Tipe Tamu",
      value: reservation.guest_type ? (
        <Badge
          variant="outline"
          className="capitalize"
        >
          {reservation.guest_type}
        </Badge>
      ) : (
        "-"
      ),
    },
    {
      label: "Status Acc",
      value: (
        <Badge
          variant="outline"
          className={cn("capitalize", statusAccBadgeColor[reservation.status_acc])}
        >
          {reservation.status_acc}
        </Badge>
      ),
    },
    {
      label: "Diskon",
      value: reservation.discount ? `${reservation.discount}%` : "-",
    },
    {
      label: "Keterangan Diskon",
      value: reservation.discount_reason,
    },
    {
      label: "Persentase Komisi",
      value: reservation.commission_percentage ? `${reservation.commission_percentage}%` : "-",
    },
    {
      label: "Jumlah Komisi",
      value: reservation.commission_amount ? formatCurrency(reservation.commission_amount as number) : "-",
    },
    {
      label: "Advance Amount",
      value: formatCurrency(reservation.advance_amount as number),
    },
    {
      label: "Advance Remarks",
      value: reservation.advance_remarks,
    },
    {
      label: "Dibuat Oleh",
      value: reservation.employee_name,
    },
    {
      label: "Total Harga",
      value: formatCurrency(reservation.total_price as number),
    },
  ];

  const reservationStatus = [
    {
      label: "Status",
      value: (
        <Badge
          variant="outline"
          className={cn("capitalize", reservationStatusBadgeColor[reservation.status])}
        >
          {reservation.status}
        </Badge>
      ),
    },
    {
      label: "Status Pembayaran",
      value: reservation.transaction_status ? (
        <Badge
          variant="outline"
          className="capitalize"
        >
          {reservation.transaction_status}
        </Badge>
      ) : (
        "-"
      ),
    },
    {
      label: "Metode Pembayaran",
      value: reservation.payment_type ? (
        <Badge
          variant="outline"
          className="capitalize"
        >
          {reservation.payment_type}
        </Badge>
      ) : (
        "-"
      ),
    },
    {
      label: "Bank Pembayaran",
      value: reservation.transaction_bank || "-",
    },
    {
      label: "Check In",
      value: reservation.formatted_check_in_at ?? "-",
    },
    {
      label: "Check In Oleh",
      value: reservation.check_in?.check_in_by ?? "-",
    },
    {
      label: "Check Out",
      value: reservation.formatted_check_out_at ?? "-",
    },
    {
      label: "Check Out Oleh",
      value: reservation.check_out?.check_out_by ?? "-",
    },
  ];

  const roomDetails = [
    {
      label: "Nomor Kamar",
      value: room?.room_number,
    },
    {
      label: "Harga Kamar",
      value: room?.room_rate ? formatCurrency(room.room_rate) : "-",
    },
    {
      label: "Tipe Kamar",
      value: room?.room_type_name ? <Badge variant="outline">{room?.room_type_name}</Badge> : "-",
    },
    {
      label: "Tipe Kasur",
      value: room?.bed_type ? <Badge variant="outline">{room?.bed_type}</Badge> : "-",
    },
    {
      label: "Smoking Type",
      value: room?.room?.smoking_type ? (
        <Badge className={cn("capitalize", smokingTypeBadgeColor[room?.room?.smoking_type as Enum.SmokingType])}>{room?.room?.smoking_type}</Badge>
      ) : (
        "-"
      ),
    },
    {
      label: "Kapasitas",
      value: room?.room?.capacity ? `${room?.room?.capacity} orang` : "-",
    },
    {
      label: "Luas Kamar",
      value: room?.room?.size ? (
        <span className="after:text-foreground relative after:absolute after:-end-2 after:top-0 after:text-[8px] after:content-['2']">
          {room?.room?.size} m
        </span>
      ) : (
        "-"
      ),
    },
    {
      label: "View",
      value: room?.view,
    },
  ];

  const guestDetails = [
    {
      label: "Nama Tamu",
      value: guest?.name,
    },
    {
      label: "NIK / Passport",
      value: guest?.nik_passport,
    },
    {
      label: "No. HP",
      value: guest?.phone,
    },
    {
      label: "Email",
      value: guest?.email,
    },
    {
      label: "Jenis Kelamin",
      value: guest?.guest?.formatted_gender ? <Badge variant="outline">{guest?.guest?.formatted_gender}</Badge> : "-",
    },
    {
      label: "Tanggal Lahir",
      value: guest?.guest?.formatted_birthdate,
    },
    {
      label: "Kewarganegaraan",
      value: guest?.nationality,
    },
    {
      label: "Negara",
      value: guest?.country,
    },
    {
      label: "Alamat",
      value: guest?.address,
    },
  ];

  // handle update reservation status
  const handleUpdateReservationStatus = useCallback(
    async (value: Enum.ReservationStatus) => {
      toast.loading("Mengubah status reservasi...", { id: "update-status" });

      router.put(
        route("reservation.update.status", { id: reservation.id }),
        {
          status: value,
        },
        {
          preserveState: true,
          onSuccess: () => {
            toast.success("Status reservasi berhasil diubah", {
              id: "update-status",
            });
          },
          onError: (error) => {
            toast.error("Gagal mengubah status reservasi", {
              id: "update-status",
              description: error.message,
            });
          },
        },
      );
    },
    [reservation.status],
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Detail Reservasi" />

      {/* reservation actions */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Data Reservasi</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <span>Lainnya</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isEmployee && isPending && <DropdownMenuItem onClick={() => setDialogOpen(true)}>Konfirmasi</DropdownMenuItem>}
            {isEmployee && !isPending && (
              <DropdownMenuItem asChild>
                <Link href={route("reservation.edit", { id: reservation.id })}>Edit</Link>
              </DropdownMenuItem>
            )}
            {isEmployee && !isPending && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Update Status</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={reservation.status}
                      onValueChange={(value) => {
                        handleUpdateReservationStatus(value as Enum.ReservationStatus);
                      }}
                    >
                      {status.map((item) => (
                        <DropdownMenuRadioItem
                          value={item}
                          className="capitalize"
                        >
                          {item}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {/* reservation status */}
        <Card className="xl:col-start-3">
          <CardHeader>
            <CardTitle className="text-lg">Status Reservasi</CardTitle>
          </CardHeader>
          <CardContent>
            <DataList data={reservationStatus} />
          </CardContent>
        </Card>

        {/* reservation details */}
        <Card className="xl:col-span-2 xl:row-span-2 xl:row-start-1">
          <CardHeader>
            <CardTitle className="text-lg">Detail Reservasi</CardTitle>
          </CardHeader>
          <CardContent>
            <DataList
              data={reservationDetails.slice(0, 9)}
              className="lg:[--columns:2] *:data-[value=Remarks]:lg:col-span-3"
            />
            <Separator className="my-5" />
            <DataList
              data={reservationDetails.slice(9, 13)}
              className="lg:[--columns:2]"
            />
            <Separator className="my-5" />
            <DataList
              data={reservationDetails.slice(13)}
              className="lg:[--columns:2]"
            />
          </CardContent>
        </Card>

        {/* room details */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Detail Kamar</CardTitle>
          </CardHeader>
          <CardContent>
            <DataList
              data={roomDetails}
              className="lg:[--columns:2]"
            />
          </CardContent>
        </Card>

        {/* guest details */}
        <Card className="col-span-1 xl:col-start-3 xl:row-span-2 xl:row-start-2">
          <CardHeader>
            <CardTitle className="text-lg">Detail Tamu</CardTitle>
          </CardHeader>
          <CardContent>
            <DataList data={guestDetails} />
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      >
        <DialogContent
          className="w-100"
          onOpenAutoFocus={(e) => e.preventDefault()}
          tabIndex={-1}
          noClose
        >
          <ConfirmPendingReservation
            data={reservation}
            onClose={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
