import { DataTable, DataTableControls } from "@/components/data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Admin",
    href: route("admin.index"),
  },
];

export default function AdminIndex(props: { admins: User.Default[]; managers: User.Default[] }) {
  const { admins, managers } = props;

  // define data table columns
  const columns: ColumnDef<User.Default>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: "Nama",
    },
    {
      id: "email",
      accessorKey: "email",
      header: "Email",
    },
  ];

  // handle admin data view
  const [view, setView] = useState<"admin" | "manager" | undefined>("admin");

  const showData = useMemo(() => {
    if (view === "admin") return admins;
    if (view === "manager") return managers;

    const merged = [...admins, ...managers];
    return merged;
  }, [view, admins, managers]);

  const adminCount = useMemo(() => admins.length, [admins]);
  const managerCount = useMemo(() => managers.length, [managers]);

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
            data={showData}
            fixed
          >
            {({ table }) => (
              <DataTableControls table={table}>
                <div className="ms-auto me-1 border-border *:text-muted-foreground *:cursor-pointer *:hover:text-foreground/80 *:data-active:border-primary *:data-active:text-primary flex items-center border-b *:grid *:h-full *:place-items-center *:px-2.5 *:data-active:border-b">
                  <Label
                    htmlFor="admin"
                    data-active={view === "admin"}
                  >
                    <div className="flex items-baseline gap-1.5">
                      <span>Admin</span>
                      <span className="px-1 h-5 rounded-sm bg-secondary grid place-items-center text-xs">{adminCount}</span>
                    </div>
                    <input
                      type="radio"
                      id="admin"
                      name="view"
                      onClick={() => setView("admin")}
                      hidden
                    />
                  </Label>
                  <Label
                    htmlFor="manager"
                    data-active={view === "manager"}
                  >
                    <div className="flex items-baseline gap-1.5">
                      <span>Manager</span>
                      <span className="px-1 h-5 rounded-sm bg-secondary grid place-items-center text-xs">{managerCount}</span>
                    </div>
                    <input
                      type="radio"
                      id="manager"
                      name="view"
                      onClick={() => setView("manager")}
                      hidden
                    />
                  </Label>
                </div>
              </DataTableControls>
            )}
          </DataTable>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
