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
    title: "Role",
    href: route("role.index"),
  },
];

export default function RoleIndex(props: { roles: Pagination<Role.Default> }) {
  const { roles } = props;
  const { delete: deleteRole } = useForm();

  // handle delete each role
  function handleDelete(e: React.FormEvent, id: string) {
    e.preventDefault();

    toast.loading("Menghapus role...", { id: `delete-${id}` });
    deleteRole(route("role.destroy", { id }), {
      onSuccess: () => toast.success("Role berhasil dihapus", { id: `delete-${id}` }),
      onError: () => toast.error("Role gagal dihapus", { id: `delete-${id}` }),
    });
  }

  // define data table columns
  const columns: ColumnDef<Role.Default>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: "Nama",
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
                <Link href={route("role.edit", { id: row.original.id })}>
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
      <Head title="Role" />
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Data Role</h1>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={roles.data}
          >
            {({ table }) => (
              <DataTableControls table={table}>
                <Button
                  className="ms-auto"
                  asChild
                >
                  <Link href={route("role.create")}>Tambah Role</Link>
                </Button>
              </DataTableControls>
            )}
          </DataTable>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
