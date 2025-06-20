import { DataTable, DataTableControls } from "@/components/data-table";
import { DataTableFilter } from "@/components/data-table/data-table-filter";
import { ReservationRangeType, SelectReservationRange } from "@/components/select-reservation-range";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AppLayout from "@/layouts/app-layout";
import { cn } from "@/lib/utils";
import { bookingTypeBadgeColor, paymentMethodBadgeColor, reservationStatusBadgeColor } from "@/static/reservation";
import { BreadcrumbItem, SharedData } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import { ColumnDef, FilterFnOption } from "@tanstack/react-table";
import { EllipsisVerticalIcon } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Reservasi",
    href: route("reservation.index"),
  },
];

export default function ReservationsIndex(props: {
  reservations: Reservation.Default[];
  type: ReservationRangeType;
  status: Enum.ReservationStatus[];
  bookingType: Enum.BookingType[];
  paymentMethod: Enum.Payment[];
  roomType: string[];
}) {
  const { reservations, type, status, bookingType, paymentMethod, roomType } = props;

  const { auth } = usePage<SharedData>().props;
  const isManager = auth.user.role === "manager";

  // define reservation table columns
  const columns: ColumnDef<Reservation.Default>[] = [
    {
      id: "booking_number",
      accessorKey: "booking_number",
      header: "No. Booking",
    },
    {
      id: "guest_name",
      accessorFn: (row) => row.reservation_guest?.name,
      header: "Nama Tamu",
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as Enum.ReservationStatus;

        return (
          <Badge
            variant="outline"
            className={cn("capitalize", reservationStatusBadgeColor[status])}
          >
            {status}
          </Badge>
        );
      },
      filterFn: "checkbox" as FilterFnOption<Reservation.Default>,
    },
    {
      id: "room_number",
      accessorFn: (row) => row.reservation_room?.room_number,
      header: "Kamar",
    },
    {
      id: "room_type",
      accessorFn: (row) => row.reservation_room?.room_type,
      header: "Tipe Kamar",
      cell: ({ row }) => {
        const roomType = row.getValue("room_type") as string;
        return <Badge variant="outline">{roomType}</Badge>;
      },
      filterFn: "checkbox" as FilterFnOption<Reservation.Default>,
    },
    {
      id: "start_date",
      accessorFn: (row) => row.formatted_start_date,
      header: "Masuk",
    },
    {
      id: "end_date",
      accessorFn: (row) => row.formatted_end_date,
      header: "Keluar",
    },
    {
      id: "booking_type",
      accessorKey: "booking_type",
      header: "Tipe Booking",
      cell: ({ row }) => {
        const bookingType = row.getValue("booking_type") as Enum.BookingType;

        return (
          <Badge
            variant="outline"
            className={cn("capitalize", bookingTypeBadgeColor[bookingType])}
          >
            {bookingType}
          </Badge>
        );
      },
      filterFn: "checkbox" as FilterFnOption<Reservation.Default>,
    },
    {
      id: "payment_method",
      accessorKey: "payment_method",
      header: "Pembayaran",
      cell: ({ row }) => {
        const paymentMethod = row.getValue("payment_method") as Enum.Payment;

        return (
          <Badge
            variant="outline"
            className={cn("capitalize", paymentMethodBadgeColor[paymentMethod])}
          >
            {paymentMethod}
          </Badge>
        );
      },
      filterFn: "checkbox" as FilterFnOption<Reservation.Default>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
            >
              <EllipsisVerticalIcon className="size-4" />
              <span className="sr-only">Aksi</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={route("reservation.show", { id: row.original.id })}>Detail</Link>
            </DropdownMenuItem>
            {!isManager && (
              <DropdownMenuItem asChild>
                <Link href={route("reservation.edit", { id: row.original.id })}>Edit</Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Reservasi" />
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Data Reservasi</h1>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={reservations}
          >
            {({ table }) => (
              <DataTableControls table={table}>
                <DataTableFilter
                  table={table}
                  extend={[
                    {
                      id: "status",
                      label: "Status",
                      data: status,
                    },
                    {
                      id: "booking_type",
                      label: "Tipe Booking",
                      data: bookingType,
                    },
                    {
                      id: "payment_method",
                      label: "Pembayaran",
                      data: paymentMethod,
                    },
                    {
                      id: "room_type" as keyof Reservation.Default,
                      label: "Tipe Kamar",
                      data: roomType,
                    },
                  ]}
                />
                <SelectReservationRange
                  type={type}
                  routeName="reservation.index"
                />
                {!isManager && (
                  <Button
                    className="ms-auto"
                    asChild
                  >
                    <Link href={route("reservation.create")}>Tambah Reservasi</Link>
                  </Button>
                )}
              </DataTableControls>
            )}
          </DataTable>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
