import { DataTable, DataTableControls } from "@/components/data-table";
import { DataTableFilter } from "@/components/data-table/data-table-filter";
import { ReservationRangeType, SelectReservationRange } from "@/components/select-reservation-range";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppLayout from "@/layouts/app-layout";
import { cn } from "@/lib/utils";
import { reservationStatusBadgeColor } from "@/static/reservation";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { ColumnDef, FilterFnOption } from "@tanstack/react-table";
import { EllipsisVerticalIcon } from "lucide-react";
import { useState } from "react";
import CheckIn from "./check-in";
import CheckOut from "./check-out";
import EditCheckIn from "./edit-check-in";
import EditCheckOut from "./edit-check-out";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Check In - Out",
    href: route("checkin.index"),
  },
];

type DialogType = "check-in" | "check-out" | "edit-check-in" | "edit-check-out" | null;

export default function CheckInIndex(props: {
  reservations: Reservation.Default[];
  type: ReservationRangeType;
  status: Enum.ReservationStatus[];
  roomStatus: Enum.RoomStatus[];
  bookingType: Enum.BookingType[];
  paymentMethod: Enum.Payment[];
  roomType: string[];
  employee: Employee.Default;
}) {
  const { reservations, type, status, roomStatus, bookingType, paymentMethod, roomType, employee } = props;

  // handle dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [selectedRow, setSelectedRow] = useState<Reservation.Default | null>(null);

  function handleDialog(type: DialogType, row: Reservation.Default) {
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
      id: "start_date",
      accessorFn: (row) => row.formatted_start_date,
      header: "Mulai",
    },
    {
      id: "check_in_date",
      accessorFn: (row) => row.formatted_check_in_at,
      header: "Check In",
      cell: ({ row }) => {
        const checkIn = row.getValue("check_in_date") as string;
        return checkIn ?? "-";
      },
    },
    {
      id: "end_date",
      accessorFn: (row) => row.formatted_end_date,
      header: "Selesai",
    },
    {
      id: "check_out_date",
      accessorFn: (row) => row.formatted_check_out_at,
      header: "Check Out",
      cell: ({ row }) => {
        const checkOut = row.getValue("check_out_date") as string;
        return checkOut ?? "-";
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const isCheckIn = row.original.check_in?.check_in_at;
        const isCheckOut = row.original.check_out?.check_out_at;

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
              <DropdownMenuLabel className={cn("text-foreground/80 hidden pt-0.5 pb-px text-xs", isCheckIn && isCheckOut && "hidden")}>
                Aksi
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => handleDialog("check-in", row.original)}
                className={cn(isCheckIn && "hidden")}
                disabled={!!isCheckIn}
              >
                Check In
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDialog("check-out", row.original)}
                className={cn(isCheckOut && "hidden")}
                disabled={!isCheckIn || !!isCheckOut}
              >
                Check Out
              </DropdownMenuItem>

              {(isCheckIn || isCheckOut) && (
                <>
                  <DropdownMenuSeparator className={cn(isCheckIn && isCheckOut && "hidden")} />
                  <DropdownMenuLabel className="text-foreground/80 pt-0.5 pb-px text-xs">Edit</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => handleDialog("edit-check-in", row.original)}
                    className={cn(!isCheckIn && "hidden")}
                  >
                    Check In
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDialog("edit-check-out", row.original)}
                    className={cn(!isCheckOut && "hidden")}
                  >
                    Check Out
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={route("reservation.show", { id: row.original.id })}>Detail Reservasi</Link>
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
              status={roomStatus}
              onClose={handleDialogClose}
            />
          )}
          {dialogType === "check-out" && selectedRow && (
            <CheckOut
              data={selectedRow}
              employee={employee}
              status={roomStatus}
              onClose={handleDialogClose}
            />
          )}
          {dialogType === "edit-check-in" && selectedRow && (
            <EditCheckIn
              data={selectedRow}
              onClose={handleDialogClose}
            />
          )}
          {dialogType === "edit-check-out" && selectedRow && (
            <EditCheckOut
              data={selectedRow}
              onClose={handleDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
