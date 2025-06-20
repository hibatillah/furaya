import { DataTable, DataTableControls } from "@/components/data-table";
import { DataTableFilter } from "@/components/data-table/data-table-filter";
import { ReservationRangeType, SelectReservationRange } from "@/components/select-reservation-range";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AppLayout from "@/layouts/app-layout";
import { cn } from "@/lib/utils";
import { bookingTypeBadgeColor, reservationStatusBadgeColor } from "@/static/reservation";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { ColumnDef, FilterFnOption } from "@tanstack/react-table";
import { EllipsisVerticalIcon } from "lucide-react";
import { useState } from "react";
import CheckIn from "./check-in";
import CheckOut from "./check-out";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Check In - Out",
    href: route("checkin.index"),
  },
];

export default function CheckInIndex(props: {
  reservations: Reservation.Default[];
  type: ReservationRangeType;
  status: Enum.ReservationStatus[];
  bookingType: Enum.BookingType[];
  paymentMethod: Enum.Payment[];
  roomType: string[];
  employee: Employee.Default;
}) {
  const { reservations, type, status, bookingType, paymentMethod, roomType, employee } = props;

  // handle dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"check-in" | "check-out" | null>(null);
  const [selectedRow, setSelectedRow] = useState<Reservation.Default | null>(null);

  function handleDialog(type: "check-in" | "check-out", row: Reservation.Default) {
    setDialogType(type);
    setSelectedRow(row);
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
    setDialogType(null);
    setSelectedRow(null);
  }

  // define reservation table columns
  const checkInColumns: ColumnDef<Reservation.Default>[] = [
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
      id: "check_in_date",
      accessorFn: (row) => row.formatted_check_in_date,
      header: "Check In",
      cell: ({ row }) => {
        const checkIn = row.getValue("check_in_date") as string;
        return checkIn ?? "-";
      },
    },
    {
      id: "check_out_date",
      accessorFn: (row) => row.formatted_check_out_date,
      header: "Check Out",
      cell: ({ row }) => {
        const checkOut = row.getValue("check_out_date") as string;
        return checkOut ?? "-";
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const isCheckIn = row.original.check_in?.checked_in_at;
        const isCheckOut = row.original.check_out?.checked_out_at;
        const isFinished = row.original.is_finished;

        return (
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
              {!isFinished && (
                <>
                  <DropdownMenuItem
                    onClick={() => handleDialog("check-in", row.original)}
                    disabled={!!isCheckIn}
                  >
                    Check In
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDialog("check-out", row.original)}
                    disabled={!!isCheckOut}
                  >
                    Check Out
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem asChild>
                <Link href={route("reservation.show", { id: row.original.id })}>Detail</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Check In • Check Out" />
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Check In - Check Out Reservasi</h1>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={checkInColumns}
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
                  routeName="checkin.index"
                />
              </DataTableControls>
            )}
          </DataTable>
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      >
        <DialogContent
          className="w-120"
          onOpenAutoFocus={(e) => e.preventDefault()}
          noClose
        >
          {dialogType === "check-in" && selectedRow && (
            <CheckIn
              data={selectedRow}
              employee={employee}
              onClose={handleDialogClose}
            />
          )}
          {dialogType === "check-out" && selectedRow && (
            <CheckOut
              data={selectedRow}
              employee={employee}
              onClose={handleDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
