import { DataTable, DataTableControls } from "@/components/data-table";
import { DataTableFilter } from "@/components/data-table/data-table-filter";
import { HelpTooltip } from "@/components/help-tooltip";
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
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppLayout from "@/layouts/app-layout";
import { cn } from "@/lib/utils";
import { roleBadgeColor } from "@/static/user";
import { BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { ColumnDef, FilterFnOption } from "@tanstack/react-table";
import { EllipsisVerticalIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UserDelete from "./delete";

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
      filterFn: "checkbox" as FilterFnOption<User.Default>,
    },
    {
      id: "status",
      header: () => (
        <div className="flex items-center gap-1">
          <span>Status</span>
          <HelpTooltip>
            Pengguna <span className="font-bold">Tidak Aktif</span> sudah dihapus dari sistem, data terkait pengguna masih tersimpan.
          </HelpTooltip>
        </div>
      ),
      accessorKey: "deleted_at",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <Badge
            variant="outline"
            className="font-medium capitalize"
          >
            {!status ? "Aktif" : "Tidak Aktif"}
          </Badge>
        );
      },
      filterFn: "radio" as FilterFnOption<User.Default>,
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
                <DropdownMenuSeparator />
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
