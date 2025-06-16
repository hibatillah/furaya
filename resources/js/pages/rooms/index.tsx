import { DataTable, DataTableControls } from "@/components/data-table";
import { DataTableFilter } from "@/components/data-table/data-table-filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AppLayout from "@/layouts/app-layout";
import { cn } from "@/lib/utils";
import { roomConditionBadgeColor, roomStatusBadgeColor } from "@/static/room";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { ColumnDef, FilterFnOption } from "@tanstack/react-table";
import { EllipsisVerticalIcon } from "lucide-react";
import { useState } from "react";
import RoomDelete from "./delete";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Kamar",
    href: route("room.index"),
  },
];

export default function RoomsIndex(props: {
  rooms: Room.Default[];
  roomTypes: RoomType.Default[];
  bedTypes: BedType.Default[];
  roomConditions: Enum.RoomCondition[];
  roomStatuses: Enum.RoomStatus[];
}) {
  const { rooms, roomTypes, bedTypes, roomConditions, roomStatuses } = props;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"delete" | "edit" | null>(null);
  const [selectedRow, setSelectedRow] = useState<Room.Default | null>(null);

  function handleDialog(type: "delete" | "edit", row: Room.Default) {
    setDialogType(type);
    setSelectedRow(row);
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
    setDialogType(null);
    setSelectedRow(null);
  }

  // define data table columns
  const columns: ColumnDef<Room.Default>[] = [
    {
      id: "room_number",
      accessorKey: "room_number",
      header: "No. Kamar",
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as Enum.RoomStatus;

        return (
          <Badge
            variant="outline"
            className={cn("rounded-full font-medium capitalize", roomStatusBadgeColor[status])}
          >
            {status}
          </Badge>
        );
      },
      filterFn: "checkbox" as FilterFnOption<Room.Default>,
    },
    {
      id: "room_type",
      accessorFn: (row) => row.room_type?.name,
      header: "Tipe Kamar",
      cell: ({ row }) => {
        const roomType = row.getValue("room_type") as string;
        return (
          <Badge
            variant="secondary"
            className="border-secondary-foreground/20 dark:border-secondary-foreground/10 rounded-full font-medium"
          >
            {roomType}
          </Badge>
        );
      },
      filterFn: "checkbox" as FilterFnOption<Room.Default>,
    },
    {
      id: "bed_type",
      accessorFn: (row) => row.bed_type?.name,
      header: "Tipe Kasur",
      cell: ({ row }) => {
        const bedType = row.getValue("bed_type") as string;
        return (
          <Badge
            variant="secondary"
            className="border-secondary-foreground/20 dark:border-secondary-foreground/10 rounded-full font-medium"
          >
            {bedType}
          </Badge>
        );
      },
      filterFn: "checkbox" as FilterFnOption<Room.Default>,
    },
    {
      id: "condition",
      accessorKey: "condition",
      header: "Kondisi",
      cell: ({ row }) => {
        const condition = row.getValue("condition") as Enum.RoomCondition;

        return (
          <Badge
            variant="outline"
            className={cn("rounded-full font-medium capitalize", roomConditionBadgeColor[condition])}
          >
            {condition}
          </Badge>
        );
      },
      filterFn: "checkbox" as FilterFnOption<Room.Default>,
    },
    {
      id: "count_facility",
      accessorKey: "count_facility",
      header: "Jumlah Fasilitas",
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
              <Link href={route("room.show", { id: row.original.id })}>Detail</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={route("room.edit", { id: row.original.id })}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => handleDialog("delete", row.original)}
            >
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Kamar" />
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Data Kamar</h1>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={rooms}
          >
            {({ table }) => (
              <DataTableControls table={table}>
                <DataTableFilter
                  table={table}
                  extend={[
                    {
                      id: "status",
                      label: "Status Kamar",
                      data: roomStatuses,
                    },
                    {
                      id: "room_type",
                      label: "Tipe Kamar",
                      data: roomTypes.map((item) => item.name),
                    },
                    {
                      id: "bed_type",
                      label: "Tipe Kasur",
                      data: bedTypes.map((item) => item.name),
                    },
                    {
                      id: "condition",
                      label: "Kondisi",
                      data: roomConditions,
                    },
                  ]}
                />
                <Button
                  className="ms-auto w-fit"
                  asChild
                >
                  <Link href={route("room.create")}>Tambah Kamar</Link>
                </Button>
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
          {dialogType === "delete" && selectedRow && (
            <RoomDelete
              id={selectedRow.id}
              onClose={handleDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
