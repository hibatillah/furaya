import { DataTable, DataTableControls } from "@/components/data-table";
import { DataTableFilter } from "@/components/data-table/data-table-filter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { cn } from "@/lib/utils";
import { roleBadgeColor } from "@/static/user";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { ColumnDef, FilterFnOption } from "@tanstack/react-table";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Admin",
    href: route("admin.index"),
  },
];

export default function AdminIndex({ admins }: { admins: User.Default[] }) {
  // define data table columns
  const columns: ColumnDef<User.Default>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: "Nama",
      cell: ({ row }) => {
        const name: string = row.getValue("name") ?? "Not Set";
        return <div className="flex min-h-10 items-center">{name}</div>;
      },
    },
    {
      id: "email",
      accessorKey: "email",
      header: "Email",
    },
    {
      id: "role",
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as Enum.Role;

        return (
          <Badge
            variant="outline"
            className={cn("font-medium capitalize", roleBadgeColor[role])}
          >
            {role}
          </Badge>
        );
      },
      filterFn: "radio" as FilterFnOption<User.Default>,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Admin" />
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Data Admin</h1>
          <p className="text-muted-foreground">List data admin dan manager</p>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={admins}
            fixed
          >
            {({ table }) => (
              <DataTableControls table={table}>
                <DataTableFilter
                  table={table}
                  filter="role"
                  data={["admin", "manager"]}
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
