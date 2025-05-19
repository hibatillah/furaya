import { DataTable, DataTableControls } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { PencilIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Customer",
    href: route("customer.index"),
  },
];

export default function CustomerIndex(props: { customers: Pagination<Customer.Default> }) {
  const { customers } = props;
  const { delete: deleteCustomer } = useForm();

  // handle delete each customer
  function handleDelete(e: React.FormEvent, id: string) {
    e.preventDefault();

    toast.loading("Menghapus customer...", { id: `delete-${id}` });
    deleteCustomer(route("customer.destroy", { id }), {
      onSuccess: () => toast.success("Customer berhasil dihapus", { id: `delete-${id}` }),
      onError: () => toast.error("Customer gagal dihapus", { id: `delete-${id}` }),
    });
  }

  // define data table columns
  const columns: ColumnDef<Customer.Default>[] = [
    {
      id: "nik_passport",
      accessorKey: "nik_passport",
      header: "NIK/Passport",
    },
    {
      id: "name",
      accessorFn: (row) => row.user?.name,
      header: "Nama",
    },
    {
      id: "birthdate",
      accessorKey: "birthdate",
      header: "Tanggal Lahir",
      cell: ({ row }) => {
        const birthdate = format(row.getValue("birthdate") as Date, "dd MMMM yyyy");
        return <span className="capitalize">{birthdate}</span>;
      },
    },
    {
      id: "email",
      accessorFn: (row) => row.user?.email,
      header: "Email",
    },
    {
      id: "phone",
      accessorKey: "phone",
      header: "Handphone",
    },
    {
      id: "nationality",
      accessorKey: "nationality",
      header: "Kewarganegaraan",
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
                <Link href={route("customer.edit", { id: row.original.id })}>
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
      <Head title="Customer" />
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Data Customer</h1>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={customers.data}
          >
            {({ table }) => (
              <DataTableControls table={table}>
                <Button
                  className="ms-auto"
                  asChild
                >
                  <Link href={route("customer.create")}>Tambah Customer</Link>
                </Button>
              </DataTableControls>
            )}
          </DataTable>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
