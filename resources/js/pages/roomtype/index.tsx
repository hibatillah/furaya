import { DataTable, DataTableControls } from "@/components/data-table";
import { DataTableFilter } from "@/components/data-table/data-table-filter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVerticalIcon } from "lucide-react";
import { useState } from "react";
import RoomTypeCreate from "./create";
import RoomTypeDelete from "./delete";
import RoomTypeEdit from "./edit";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Tipe Kamar",
    href: route("roomtype.index"),
  },
];

export default function RoomTypeIndex(props: { roomTypes: RoomType.Default[] }) {
  const { roomTypes } = props;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"delete" | "edit" | null>(null);
  const [selectedRow, setSelectedRow] = useState<RoomType.Default | null>(null);

  function handleDialog(type: "delete" | "edit", row: RoomType.Default) {
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
    },
    {
      accessorKey: "rooms_count",
      header: "Jumlah Kamar",
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
            <DropdownMenuItem onClick={() => handleDialog("edit", row.original)}>Edit</DropdownMenuItem>
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
                <RoomTypeCreate />
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
            <RoomTypeDelete
              id={selectedRow.id}
              onClose={handleDialogClose}
            />
          )}
          {dialogType === "edit" && selectedRow && (
            <RoomTypeEdit
              data={selectedRow}
              onClose={handleDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
