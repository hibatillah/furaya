import { DataTable, DataTableControls } from "@/components/data-table";
import { HelpTooltip } from "@/components/help-tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AppLayout from "@/layouts/app-layout";
import { cn } from "@/lib/utils";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVerticalIcon } from "lucide-react";
import { useState } from "react";
import FacilityCreate from "./create";
import FacilityDelete from "./delete";
import FacilityEdit from "./edit";
import FacilityShow from "./show";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Fasilitas",
    href: route("facility.index"),
  },
];

export default function FacilityIndex(props: { facilities: Facility.Default[] }) {
  const { facilities } = props;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"delete" | "edit" | "show" | null>(null);
  const [selectedRow, setSelectedRow] = useState<Facility.Default | null>(null);

  function handleDialog(type: "delete" | "edit" | "show", row: Facility.Default) {
    setDialogType(type);
    setSelectedRow(row);
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
    setDialogType(null);
    setSelectedRow(null);
  }

  const columns: ColumnDef<Facility.Default>[] = [
    {
      accessorKey: "name",
      header: "Nama",
    },
    {
      accessorKey: "rooms_count",
      header: () => (
        <div className="flex items-center gap-1">
          <span>Digunakan</span>
          <HelpTooltip>Jumlah kamar yang menggunakan fasilitas</HelpTooltip>
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
            <DropdownMenuItem onClick={() => handleDialog("show", row.original)}>Detail</DropdownMenuItem>
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
      <Head title="Fasilitas" />
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Data Fasilitas</h1>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={facilities}
          >
            {({ table }) => (
              <DataTableControls table={table}>
                <FacilityCreate />
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
          className={cn("w-100", dialogType === "show" && "w-110")}
          onOpenAutoFocus={(e) => e.preventDefault()}
          noClose
        >
          {dialogType === "delete" && selectedRow && (
            <FacilityDelete
              id={selectedRow.id}
              canDelete={selectedRow.can_delete}
              onClose={handleDialogClose}
            />
          )}
          {dialogType === "edit" && selectedRow && (
            <FacilityEdit
              data={selectedRow}
              onClose={handleDialogClose}
            />
          )}
          {dialogType === "show" && selectedRow && (
            <FacilityShow
              data={selectedRow}
              onClose={handleDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
