import { DataTable, DataTableControls } from "@/components/data-table";
import { DataTableFilter } from "@/components/data-table/data-table-filter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { PencilIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Tipe Kamar",
    href: route("roomtype.index"),
  },
];

export default function RoomTypeIndex(props: { roomTypes: Pagination<RoomType.Default> }) {
  const { roomTypes } = props;
  const { delete: deleteRoomType } = useForm();

  function handleDelete(e: React.FormEvent, id: string) {
    e.preventDefault();

    toast.loading("Menghapus tipe kamar...", { id: `delete-${id}` });
    deleteRoomType(route("roomtype.destroy", { id }), {
      onSuccess: () => toast.success("Tipe kamar berhasil dihapus", { id: `delete-${id}` }),
      onError: () => toast.error("Tipe kamar gagal dihapus", { id: `delete-${id}` }),
    });
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
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                asChild
              >
                <Link href={route("roomtype.edit", { id: row.original.id })}>
                  <PencilIcon className="size-3" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Data</p>
            </TooltipContent>
          </Tooltip>
          <form onSubmit={(e) => handleDelete(e, row.original.id)}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 cursor-pointer"
                  type="submit"
                >
                  <TrashIcon className="size-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Hapus Data</p>
              </TooltipContent>
            </Tooltip>
          </form>
        </div>
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
            data={roomTypes.data}
          >
            {({ table }) => (
              <DataTableControls table={table}>
                <DataTableFilter table={table} />
                <Button
                  className="ms-auto w-fit"
                  asChild
                >
                  <Link href={route("roomtype.create")}>Tambah Tipe Kamar</Link>
                </Button>
              </DataTableControls>
            )}
          </DataTable>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
