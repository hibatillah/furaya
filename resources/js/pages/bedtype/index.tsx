import { DataTable, DataTableControls } from "@/components/data-table";
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
    title: "Tipe Kasur",
    href: route("bedtype.index"),
  },
];

export default function BedTypeIndex(props: { bedTypes: Pagination<BedType.Default> }) {
  const { bedTypes } = props;
  const { delete: deleteBedType } = useForm();

  // handle delete each bed type
  function handleDelete(e: React.FormEvent, id: string) {
    e.preventDefault();

    toast.loading("Menghapus tipe kasur...", { id: `delete-${id}` });
    deleteBedType(route("bedtype.destroy", { id }), {
      onSuccess: () => toast.success("Tipe kasur berhasil dihapus", { id: `delete-${id}` }),
      onError: () => toast.error("Tipe kasur gagal dihapus", { id: `delete-${id}` }),
    });
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
                <Link href={route("bedtype.edit", { id: row.original.id })}>
                  <PencilIcon className="size-3" />
                  <span className="sr-only">Edit Data</span>
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
                  <span className="sr-only">Hapus Data</span>
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
      <Head title="Tipe Kasur" />
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Tipe Kasur</h1>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={bedTypes.data}
          >
            {({ table }) => (
              <DataTableControls table={table}>
                <Button
                  className="ms-auto w-fit"
                  asChild
                >
                  <Link href={route("bedtype.create")}>Tambah Tipe Kasur</Link>
                </Button>
              </DataTableControls>
            )}
          </DataTable>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
