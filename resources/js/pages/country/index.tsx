import { DataTable, DataTableControls } from "@/components/data-table";
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
import CountryCreate from "./create";
import CountryDelete from "./delete";
import CountryEdit from "./edit";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Negara",
    href: route("country.index"),
  },
];

export default function CountryIndex(props: { countries: Country.Default[] }) {
  const { countries } = props;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"delete" | "edit" | "show" | null>(null);
  const [selectedRow, setSelectedRow] = useState<Country.Default | null>(null);

  function handleDialog(type: "delete" | "edit" | "show", row: Country.Default) {
    setDialogType(type);
    setSelectedRow(row);
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
    setDialogType(null);
    setSelectedRow(null);
  }

  const columns: ColumnDef<Country.Default>[] = [
    {
      accessorKey: "code",
      header: "Kode",
    },
    {
      accessorKey: "name",
      header: "Nama",
    },
    {
      accessorKey: "user.name",
      header: "Dibuat Oleh",
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
      <Head title="Negara" />
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Data Negara</h1>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={countries}
          >
            {({ table }) => (
              <DataTableControls table={table}>
                <CountryCreate />
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
            <CountryDelete
              id={selectedRow.id}
              onClose={handleDialogClose}
            />
          )}
          {dialogType === "edit" && selectedRow && (
            <CountryEdit
              data={selectedRow}
              onClose={handleDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
