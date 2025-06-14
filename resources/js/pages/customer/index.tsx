import { DataTable, DataTableControls } from "@/components/data-table";
import { DataTableFilter } from "@/components/data-table/data-table-filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { ColumnDef, FilterFnOption } from "@tanstack/react-table";
import { EllipsisVerticalIcon } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Customer",
    href: route("customer.index"),
  },
];

// define data table columns
export const columns: ColumnDef<Customer.Default>[] = [
  {
    id: "name",
    accessorKey: "user.name",
    header: "Nama",
  },
  {
    id: "nik_passport",
    accessorKey: "nik_passport",
    header: "NIK/Passport",
  },
  {
    id: "email",
    accessorKey: "user.email",
    header: "Email",
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: "Handphone",
  },
  {
    id: "gender",
    accessorKey: "formatted_gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.getValue("gender") as string;
      return (
        <Badge
          variant="outline"
          className="text-sm"
        >
          {gender}
        </Badge>
      );
    },
    filterFn: "radio" as FilterFnOption<Customer.Default>,
  },
  {
    id: "nationality",
    accessorKey: "nationality",
    header: "Kewarganegaraan",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
          >
            <EllipsisVerticalIcon className="size-4" />
            <span className="sr-only">Aksi</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link
              href={route("customer.show", { id: row.original.id })}
              className="w-full"
            >
              Detail
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href={route("customer.edit", { id: row.original.id })}
              className="w-full"
            >
              Edit
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function CustomerIndex(props: { customers: Customer.Default[] }) {
  const { customers } = props;


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
            data={customers}
          >
            {({ table }) => (
              <DataTableControls table={table}>
                <DataTableFilter
                  table={table}
                  filter="gender"
                  data={["Pria", "Wanita"]}
                  standalone
                />
              </DataTableControls>
            )}
          </DataTable>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
