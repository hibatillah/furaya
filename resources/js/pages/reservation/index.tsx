import { DataTable, DataTableControls } from "@/components/data-table";
import { DataTableFilter } from "@/components/data-table/data-table-filter";
import { ReservationRangeType, SelectReservationRange } from "@/components/select-reservation-range";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import AppLayout from "@/layouts/app-layout";
import { cn } from "@/lib/utils";
import { bookingTypeBadgeColor, reservationStatusBadgeColor, transactionStatusBadgeColor } from "@/static/reservation";
import { BreadcrumbItem, SharedData } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { ColumnDef, FilterFnOption } from "@tanstack/react-table";
import { EllipsisVerticalIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ConfirmPendingReservation from "./confirm";

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
  roomType: string[];
  statusAcc: Enum.StatusAcc[];
  is_pending: boolean;
  count_pending_reservation: number;
}) {
  const { reservations, type, status, bookingType, roomType, statusAcc, is_pending, count_pending_reservation } = props;

  const { auth } = usePage<SharedData>().props;
  const isEmployee = auth.user.role === "employee";

  // handle dialog form
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"confirm" | null>(null);
  const [selectedRow, setSelectedRow] = useState<Reservation.Default | null>(null);

  function handleDialog(type: "confirm", row: Reservation.Default) {
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
      id: "room_type_name",
      accessorFn: (row) => row.reservation_room?.room_type_name,
      header: "Tipe Kamar",
      cell: ({ row }) => {
        const roomType = row.getValue("room_type_name") as string;
        return <Badge variant="outline">{roomType}</Badge>;
      },
      filterFn: "checkbox" as FilterFnOption<Reservation.Default>,
    },
    {
      id: "room_number",
      accessorFn: (row) => row.reservation_room?.room_number,
      header: "No. Kamar",
      cell: ({ row }) => {
        const roomNumber = row.getValue("room_number") as string;
        return roomNumber ?? "-";
      },
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
      id: "transaction_status",
      accessorKey: "transaction_status",
      header: "Payment Status",
      cell: ({ row }) => {
        const transactionStatus = row.getValue("transaction_status") as string;

        return !transactionStatus ? (
          "-"
        ) : (
          <Badge
            variant="outline"
            className={cn("capitalize", transactionStatusBadgeColor[transactionStatus])}
          >
            {transactionStatus}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const id = row.original.id;
        const statusAcc = row.getValue("status_acc") as Enum.StatusAcc;
        const isPending = statusAcc === "pending";

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
              {isEmployee && isPending && (
                <>
                  <DropdownMenuItem onClick={() => handleDialog("confirm", row.original)}>Konfirmasi</DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem asChild>
                <Link href={route("reservation.show", { id })}>Detail</Link>
              </DropdownMenuItem>
              {isEmployee && !isPending && (
                <DropdownMenuItem asChild>
                  <Link href={route("reservation.edit", { id })}>Edit</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // handle pending reservation
  const [isPending, setIsPending] = useState(is_pending);
  const handlePendingReservation = useCallback((value: boolean) => {
    router.get(
      route("reservation.index"),
      {
        is_pending: value,
      },
      { preserveState: true },
    );
  }, []);

  useEffect(() => setIsPending(is_pending), [is_pending]);

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
                      id: "status_acc",
                      label: "Status Acc",
                      data: statusAcc,
                    },
                    {
                      id: "booking_type",
                      label: "Tipe Booking",
                      data: bookingType,
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

                {/* toggle pending reservation view */}
                <Button
                  variant="outline"
                  asChild
                >
                  <Label
                    htmlFor="is_pending"
                    className="ms-auto hidden px-3" // currently not used
                  >
                    <span className="text-primary text-sm font-medium">{count_pending_reservation}</span>
                    <span>Pending Reservasi</span>
                    <Switch
                      id="is_pending"
                      checked={isPending}
                      onCheckedChange={(value) => {
                        setIsPending(value);
                        handlePendingReservation(value);
                      }}
                    />
                  </Label>
                </Button>

                {/* create reservation for employee */}
                {isEmployee && (
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
          {dialogType === "confirm" && selectedRow && (
            <ConfirmPendingReservation
              data={selectedRow}
              onClose={handleDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
