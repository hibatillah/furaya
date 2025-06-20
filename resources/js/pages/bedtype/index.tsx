import { DataTable, DataTableControls } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { ColumnDef, FilterFnOption } from "@tanstack/react-table";
import { EllipsisVerticalIcon } from "lucide-react";
import { useState } from "react";
import BedTypeCreate from "./create";
import BedTypeDelete from "./delete";
import BedTypeEdit from "./edit";
import { DataTableFilter } from "@/components/data-table/data-table-filter";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Tipe Kasur",
    href: route("bedtype.index"),
  },
];

export default function BedTypeIndex(props: { bedTypes: BedType.Default[] }) {
  const { bedTypes } = props;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"delete" | "edit" | null>(null);
  const [selectedRow, setSelectedRow] = useState<BedType.Default | null>(null);

  function handleDialog(type: "delete" | "edit", row: BedType.Default) {
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
  const columns: ColumnDef<BedType.Default>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: "Nama",
      cell: ({ row }) => {
        return <span className="w-full text-center capitalize">{row.original.name}</span>;
      },
    },
    {
      id: "rooms_count",
      accessorKey: "rooms_count",
      header: "Jumlah Kamar",
      filterFn: "checkbox" as FilterFnOption<BedType.Default>,  // add filter column
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
      <Head title="Tipe Kasur" />
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Tipe Kasur</h1>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={bedTypes}
          >
            {({ table }) => (
              <DataTableControls table={table}>
                <DataTableFilter table={table} />
                <BedTypeCreate />
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
            <BedTypeDelete
              id={selectedRow.id}
              canDelete={selectedRow.can_delete}
              onClose={handleDialogClose}
            />
          )}
          {dialogType === "edit" && selectedRow && (
            <BedTypeEdit
              data={selectedRow}
              onClose={handleDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
