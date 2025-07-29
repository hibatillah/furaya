import { DataTable, DataTableControls } from "@/components/data-table";
import { DataTableFilter } from "@/components/data-table/data-table-filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AppLayout from "@/layouts/app-layout";
import { genderBadgeColor } from "@/static/user";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { ColumnDef, FilterFnOption } from "@tanstack/react-table";
import { EllipsisVerticalIcon } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Tamu",
    href: route("guest.index"),
  },
];

// define data table columns
export const columns: ColumnDef<Guest.Default>[] = [
  {
    id: "name",
    accessorKey: "user.name",
    header: "Nama",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return <div className="max-w-64 truncate">{name}</div>;
    },
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: "Handphone",
  },
  {
    id: "email",
    accessorKey: "user.email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return <div className="max-w-60 truncate">{email}</div>;
    },
  },
  {
    id: "gender",
    accessorKey: "formatted_gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.original.gender as Enum.Gender;
      const formattedGender = row.getValue("gender") as string;

      return (
        <Badge
          variant="outline"
          className={genderBadgeColor[gender]}
        >
          {formattedGender}
        </Badge>
      );
    },
    filterFn: "radio" as FilterFnOption<Guest.Default>,
  },
  {
    id: "address",
    accessorKey: "address",
    header: "Alamat",
    cell: ({ row }) => {
      const address = row.getValue("address") as string;
      return <div className="max-w-[500px] truncate">{address ?? "-"}</div>;
    },
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
          <DropdownMenuItem asChild>
            <Link
              href={route("guest.show", { id: row.original.id })}
              className="w-full"
            >
              Detail
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={route("guest.edit", { id: row.original.id })}
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

export default function GuestIndex(props: { guests: Guest.Default[] }) {
  const { guests } = props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tamu" />
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Data Tamu</h1>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={guests}
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
