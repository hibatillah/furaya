import { DataTable, DataTableControls } from "@/components/data-table";
import { DataTableFilter } from "@/components/data-table/data-table-filter";
import { HelpTooltip } from "@/components/help-tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AppLayout from "@/layouts/app-layout";
import { formatCurrency } from "@/lib/utils";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { ColumnDef, FilterFnOption } from "@tanstack/react-table";
import { EllipsisVerticalIcon } from "lucide-react";
import { useState } from "react";
import RoomTypeDelete from "./delete";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Tipe Kamar",
    href: route("roomtype.index"),
  },
];

export default function RoomTypeIndex(props: { roomTypes: RoomType.Default[]; bedTypes: BedType.Default[] }) {
  const { roomTypes, bedTypes } = props;

  // handle dialog form
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

  // define columns
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
      id: "bed_type",
      accessorFn: (row) => row.bed_type?.name,
      header: "Tipe Kasur",
      cell: ({ row }) => {
        const bedType = row.getValue("bed_type") as string;
        return (
          <Badge
            variant="secondary"
            className="border-secondary-foreground/20 dark:border-secondary-foreground/10 font-medium"
          >
            {bedType}
          </Badge>
        );
      },
      filterFn: "checkbox" as FilterFnOption<RoomType.Default>,
    },
    {
      id: "capacity",
      accessorKey: "capacity",
      header: "Kapasitas",
      cell: ({ row }) => {
        const capacity = row.getValue("capacity") as number;
        return `${capacity} orang`;
      },
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
      id: "size",
      accessorKey: "size",
      header: "Luas Kamar",
      cell: ({ row }) => {
        const size = row.getValue("size") as number;

        return !size ? (
          "-"
        ) : (
          <span className="after:text-foreground relative after:absolute after:-end-2 after:top-0 after:text-[8px] after:content-['2']">
            {size} m
          </span>
        );
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
            <DropdownMenuItem asChild>
              <Link href={route("roomtype.show", { id: row.original.id })}>Detail</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={route("roomtype.edit", { id: row.original.id })}>Edit</Link>
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
                <DataTableFilter
                  table={table}
                  extend={[
                    {
                      id: "bed_type",
                      label: "Tipe Kasur",
                      data: bedTypes.map((item) => item.name),
                    },
                  ]}
                />
                <Button asChild>
                  <Link
                    href={route("roomtype.create")}
                    className="ms-auto"
                  >
                    Tambah Tipe Kamar
                  </Link>
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
            <RoomTypeDelete
              id={selectedRow.id}
              canDelete={selectedRow.can_delete}
              onClose={handleDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
