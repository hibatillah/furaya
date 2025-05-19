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
    title: "Admin",
    href: "/admin",
  },
];

export default function AdminIndex(props: { admins: Pagination<Admin.Default> }) {
  const { admins } = props;
  const { delete: deleteAdmin } = useForm();

  // handle delete each admin
  const handleDelete = (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();

    toast.loading("Menghapus admin...", { id: `delete-${id}` });
    deleteAdmin(route("admin.destroy", { id }), {
      onSuccess: () => toast.success("Admin berhasil dihapus", { id: `delete-${id}` }),
      onError: () => toast.error("Admin gagal dihapus", { id: `delete-${id}` }),
    });
  };

  // define data table columns
  const columns: ColumnDef<Admin.Default>[] = [
    {
      id: "name",
      accessorFn: (row) => row.user?.name,
      header: "Nama",
    },
    {
      id: "email",
      accessorFn: (row) => row.user?.email,
      header: "Email",
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
                <Link href={route("admin.edit", { id: row.original.id })}>
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
      <Head title="Admin" />
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Data Admin</h1>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={admins.data}
          >
            {({ table }) => (
              <DataTableControls table={table}>
                <Button
                  className="ms-auto"
                  asChild
                >
                  <Link href={route("admin.create")}>Tambah Admin</Link>
                </Button>
              </DataTableControls>
            )}
          </DataTable>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
