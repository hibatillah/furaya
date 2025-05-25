import { DataTable, DataTableControls } from "@/components/data-table";
import { DataTableFilter } from "@/components/data-table/data-table-filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { ColumnDef, FilterFnOption } from "@tanstack/react-table";
import { EllipsisVerticalIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Pengguna",
    href: route("user.index"),
  },
];

export default function UserIndex(props: { users: Pagination<User.Default>; roles: Role.Default[] }) {
  const { users, roles } = props;

  // define users columns
  const columns: ColumnDef<User.Default>[] = [
    {
      id: "name",
      header: "Nama",
      accessorKey: "name",
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
    },
    {
      id: "role",
      header: "Role",
      accessorFn: (row) => row.role?.name,
      cell: ({ row }) => {
        const role: string = row.getValue("role") ?? "Not Set";
        const badgeColor = {
          manager: "bg-indigo-500 text-indigo-100 dark:bg-indigo-900 dark:text-indigo-100",
          admin: "bg-blue-500 text-blue-100 dark:bg-blue-900 dark:text-blue-100",
          employee: "bg-emerald-500 text-emerald-100 dark:bg-emerald-900 dark:text-emerald-100",
          customer: "bg-yellow-500 text-yellow-100 dark:bg-yellow-900 dark:text-yellow-100",
        };

        return (
          <Badge
            variant={role === "Not Set" ? "secondary" : "default"}
            className={cn(
              "rounded-full font-medium capitalize",
              badgeColor[role.toLowerCase() as keyof typeof badgeColor]
            )}
          >
            {role}
          </Badge>
        );
      },
      filterFn: "checkbox" as FilterFnOption<User.Default>,
    },
    {
      id: "action",
      cell: ({ row }) => {
        const userId = row.original.id;
        const userRoleId = row.original.role_id;

        const [selectedRole, setSelectedRole] = useState(userRoleId);
        const { patch, data, setData } = useForm<Pick<User.Default, "role_id">>({ role_id: userRoleId });

        // handle update user role
        useEffect(() => {
          if (selectedRole !== userRoleId) {
            toast.loading("Mengubah role pengguna...", {
              id: `update-user-role-${userId}`,
            });

            patch(route("user.update", { id: userId }), {
              onSuccess: () => {
                toast.success("Role pengguna berhasil diubah", {
                  id: `update-user-role-${userId}`,
                });
              },
              onError: () => {
                toast.error("Gagal mengubah role pengguna", {
                  id: `update-user-role-${userId}`,
                });
              },
            });
          }
        }, [selectedRole]);

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
              >
                <EllipsisVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Pilih Role</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={data.role_id}
                    onValueChange={(value: string) => {
                      setData({ role_id: value });
                      setSelectedRole(value);
                    }}
                  >
                    {roles.map((item) => (
                      <DropdownMenuRadioItem
                        value={item.id}
                        className="capitalize"
                      >
                        {item.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Pengguna" />
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Pengguna</h1>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={users.data}
          >
            {({ table }) => (
              <DataTableControls table={table}>
                <DataTableFilter
                  table={table}
                  filter="role"
                  data={roles.map((e) => e.name)}
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
