import { DataList } from "@/components/data-list";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { cn, formatCurrency } from "@/lib/utils";
import { reservationStatusBadgeColor } from "@/static/reservation";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export default function ReservationsTransaction(props: { reservation: Reservation.Default }) {
  const { reservation } = props;
  console.log(reservation);

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
    {
      title: "Transaksi",
      href: route("reservation.transaction", { id: reservation.id }),
    },
  ];

  // define reservation details
  const reservationDetails = [
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
      label: "Nomor Reservasi",
      value: reservation.booking_number,
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
      label: "Total Harga",
      value: formatCurrency(reservation.total_price as number),
    },
    {
      label: "Balance",
      value: formatCurrency(reservation.total_price as number),
    },
  ];

  // define reservation transaction columns
  const columns: ColumnDef<ReservationTransaction.Default>[] = [
    {
      id: "created_at",
      accessorKey: "created_at",
      header: "Tanggal",
      cell: ({ row }) => {
        const date = row.getValue("created_at") as Date;
        return format(new Date(date), "PP");
      },
    },
    {
      id: "amount",
      accessorKey: "amount",
      header: "Jumlah",
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number;
        return formatCurrency(amount);
      },
    },
    {
      id: "description",
      accessorKey: "description",
      header: "Deskripsi",
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Riwayat Transaksi" />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* reservation details */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Detail Reservasi</CardTitle>
          </CardHeader>
          <CardContent>
            <DataList
              data={reservationDetails}
              className="xl:[--columns:2]"
            />
          </CardContent>
        </Card>

        {/* reservation transaction */}
        <Card className="h-fit">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-lg">Riwayat Transaksi Reservasi</CardTitle>
            <Button variant="default">Tambah Transaksi</Button>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={reservation.reservation_transaction as unknown as ReservationTransaction.Default[]}
              controls={{
                pagination: false,
              }}
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
