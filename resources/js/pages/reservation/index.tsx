import { DataTable, DataTableControls } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, SharedData } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import { ColumnDef, FilterFnOption } from "@tanstack/react-table";
import { EllipsisVerticalIcon } from "lucide-react";
import { useState } from "react";
import CheckIn from "./check-in";
import CheckOut from "./check-out";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Reservasi",
    href: route("reservation.index"),
  },
];

// define reservation table columns
export const reservationColumns: ColumnDef<Reservation.Default>[] = [
  {
    id: "booking_number",
    accessorKey: "booking_number",
    header: "Nomor Reservasi",
  },
  {
    id: "customer",
    accessorKey: "customer.name",
    header: "Customer",
  },
  {
    id: "room_number",
    accessorKey: "room.room_number",
    header: "Kamar",
  },
  {
    id: "room_status",
    accessorKey: "room_status",
    header: "Status Kamar",
    cell: ({ row }) => {
      const roomStatus = row.getValue("room_status") as Enum.RoomStatus;

      return (
        <Badge
          variant="secondary"
          className="text-sm capitalize"
        >
          {roomStatus}
        </Badge>
      );
    },
    filterFn: "checkbox" as FilterFnOption<Reservation.Default>,
  },
  {
    id: "booking_type",
    accessorKey: "booking_type",
    header: "Tipe Reservasi",
    cell: ({ row }) => {
      const bookingType = row.getValue("booking_type") as Enum.BookingType;

      return (
        <Badge
          variant="secondary"
          className="text-sm capitalize"
        >
          {bookingType}
        </Badge>
      );
    },
    filterFn: "checkbox" as FilterFnOption<Reservation.Default>,
  },
  {
    id: "check_in",
    accessorKey: "formatted_check_in",
    header: "Check In",
  },
  {
    id: "check_out",
    accessorKey: "formatted_check_out",
    header: "Check Out",
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
          <DropdownMenuItem asChild>
            <Link href={route("reservation.edit", { id: row.original.id })}>Edit</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function ReservationsIndex(props: { reservations: Reservation.Default[] }) {
  const { reservations } = props;

  const { auth } = usePage<SharedData>().props;
  const isManager = auth.user.role === "manager";

  // handle checkIn dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"check_in" | "check_out" | null>(null);
  const [selectedRow, setSelectedRow] = useState<Reservation.Default | null>(null);

  function handleDialog(type: "check_in" | "check_out", row: Reservation.Default) {
    setDialogType(type);
    setSelectedRow(row);
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
    setDialogType(null);
    setSelectedRow(null);
  }

  // customize actions column
  const customReservationActions: ColumnDef<Reservation.Default>[] = [
    ...reservationColumns.slice(0, -1), // remove default actions column
    {
      id: "actions",
      cell: ({ row }) => {
        const isCheckIn = row.original.is_check_in;
        const isCheckOut = row.original.is_check_out;

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
              {!isCheckIn && (
                <DropdownMenuItem
                  onClick={() => handleDialog("check_in", row.original)}
                  disabled={isCheckOut}
                >
                  Check In
                </DropdownMenuItem>
              )}
              {!isCheckOut && (
                <DropdownMenuItem
                  onClick={() => handleDialog("check_out", row.original)}
                  disabled={isCheckIn}
                >
                  Check Out
                </DropdownMenuItem>
              )}
              {(!isCheckIn || !isCheckOut) && <DropdownMenuSeparator />}
              <DropdownMenuItem asChild>
                <Link href={route("reservation.show", { id: row.original.id })}>Detail</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={route("reservation.edit", { id: row.original.id })}>Edit</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
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
            columns={customReservationActions}
            data={reservations}
          >
            {({ table }) => (
              <DataTableControls table={table}>
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

      {/* dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      >
        <DialogContent
          className="w-120"
          onOpenAutoFocus={(e) => e.preventDefault()}
          noClose
        >
          {dialogType === "check_in" && selectedRow && (
            <CheckIn
              reservationId={selectedRow.id}
              onClose={handleDialogClose}
            />
          )}
          {dialogType === "check_out" && selectedRow && (
            <CheckOut
              reservationId={selectedRow.id}
              onClose={handleDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
