import { DataTable, DataTableControls } from "@/components/data-table";
import { DataTableFilter } from "@/components/data-table/data-table-filter";
import { HelpTooltip } from "@/components/help-tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AppLayout from "@/layouts/app-layout";
import { cn, formatCurrency } from "@/lib/utils";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVerticalIcon } from "lucide-react";
import { useState } from "react";
import RoomTypeCreate from "./create";
import RoomTypeDelete from "./delete";
import RoomTypeEdit from "./edit";
import RoomTypeShow from "./show";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Tipe Kamar",
    href: route("roomtype.index"),
  },
];

export default function RoomTypeIndex(props: {
  roomTypes: RoomType.Default[];
  facilities: Facility.Default[];
  rateTypes: RateType.Default[];
}) {
  const { roomTypes, facilities, rateTypes } = props;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"detail" | "delete" | "edit" | null>(null);
  const [selectedRow, setSelectedRow] = useState<RoomType.Default | null>(null);

  function handleDialog(type: "detail" | "delete" | "edit", row: RoomType.Default) {
    setDialogType(type);
    setSelectedRow(row);
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
    setDialogType(null);
    setSelectedRow(null);
  }

  const columns: ColumnDef<RoomType.Default>[] = [
    {
      accessorKey: "code",
      header: "Kode",
    },
    {
      accessorKey: "name",
      header: "Nama",
    },
    {
      accessorKey: "capacity",
      header: "Kapasitas",
    },
    {
      accessorKey: "base_rate",
      header: "Tarif Dasar",
      cell: ({ row }) => {
        const baseRate = row.original.base_rate as number;
        return formatCurrency(baseRate);
      },
    },
    {
      accessorKey: "facilities_count",
      header: "Jumlah Fasilitas",
    },
    {
      accessorKey: "rooms_count",
      header: () => (
        <div className="flex items-center gap-1">
          <span>Digunakan</span>
          <HelpTooltip>Jumlah kamar yang menggunakan tipe kamar</HelpTooltip>
        </div>
      ),
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
            <DropdownMenuItem onClick={() => handleDialog("detail", row.original)}>Detail</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDialog("edit", row.original)}>Edit</DropdownMenuItem>
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
      <Head title="Tipe Kamar" />
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Data Tipe Kamar</h1>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={roomTypes}
          >
            {({ table }) => (
              <DataTableControls table={table}>
                <DataTableFilter table={table} />
                <RoomTypeCreate facilities={facilities} rateTypes={rateTypes} />
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
          className={cn({
            "w-120": dialogType === "detail" || dialogType === "delete",
            "!max-w-200": dialogType === "edit",
          })}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onFocus={(e) => e.preventDefault()}
          noClose
        >
          {dialogType === "detail" && selectedRow && (
            <RoomTypeShow
              data={selectedRow}
              onClose={handleDialogClose}
            />
          )}
          {dialogType === "delete" && selectedRow && (
            <RoomTypeDelete
              id={selectedRow.id}
              canDelete={selectedRow.can_delete}
              onClose={handleDialogClose}
            />
          )}
          {dialogType === "edit" && selectedRow && (
            <RoomTypeEdit
              data={selectedRow}
              facilities={facilities}
              rateTypes={rateTypes}
              onClose={handleDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
