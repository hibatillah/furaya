import { DataTable, DataTableControls } from "@/components/data-table";
import { DataTableFilter } from "@/components/data-table/data-table-filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import { cn } from "@/lib/utils";
import { BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { ColumnDef, FilterFnOption } from "@tanstack/react-table";
import { EllipsisVerticalIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UserDelete from "./delete";
import { RoleBadgeColor } from "./utils";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Pengguna",
    href: route("user.index"),
  },
];

export default function UserIndex(props: { users: User.Default[]; roles: Enum.Role[] }) {
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
      accessorFn: (row) => row.role,
      cell: ({ row }) => {
        const role: string = row.getValue("role") ?? "Not Set";

        return (
          <Badge
            variant={role === "Not Set" ? "secondary" : "default"}
            className={cn("font-medium capitalize", RoleBadgeColor[role.toLowerCase() as keyof typeof RoleBadgeColor])}
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
        const userRoleId = row.getValue("role");

        const [selectedRole, setSelectedRole] = useState(userRoleId);
        const { patch, data, setData } = useForm<Pick<User.Default, "role">>({ role: userRoleId as Enum.Role });

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
              onError: (error) => {
                toast.error("Gagal mengubah role pengguna", {
                  description: error.message,
                  id: `update-user-role-${userId}`,
                });
              },
            });
          }
        }, [selectedRole]);

        return (
          <Dialog>
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
                      value={data.role}
                      onValueChange={(value: string) => {
                        setData({ role: value as Enum.Role });
                        setSelectedRole(value);
                      }}
                    >
                      {roles.map((item) => (
                        <DropdownMenuRadioItem
                          value={item}
                          className="capitalize"
                        >
                          {item}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DialogTrigger asChild>
                  <DropdownMenuItem variant="destructive">Hapus</DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="w-110">
              <UserDelete user_id={userId} />
            </DialogContent>
          </Dialog>
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
            data={users}
          >
            {({ table }) => (
              <DataTableControls table={table}>
                <DataTableFilter
                  table={table}
                  filter="role"
                  data={roles}
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
