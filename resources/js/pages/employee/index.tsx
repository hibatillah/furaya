import { DataTable, DataTableControls } from "@/components/data-table";
import { DataTableFilter } from "@/components/data-table/data-table-filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AppLayout from "@/layouts/app-layout";
import { cn } from "@/lib/utils";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { ColumnDef, FilterFnOption } from "@tanstack/react-table";
import { EllipsisVerticalIcon } from "lucide-react";
import { useState } from "react";
import EmployeeDelete from "./delete";
import EmployeeShow from "./show";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Karyawan",
    href: route("employee.index"),
  },
];

export default function EmployeeIndex(props: { employees: Employee.Default[]; departments: Department.Default[] }) {
  const { employees, departments } = props;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType | null>(null);
  const [selectedRow, setSelectedRow] = useState<Employee.Default | null>(null);

  function handleDialog(type: DialogType, row: Employee.Default) {
    setDialogType(type);
    setSelectedRow(row);
    setDialogOpen(true);
  }

  function handleDialogClose() {
    setDialogOpen(false);
    setDialogType(null);
    setSelectedRow(null);
  }

  // define data table columns
  const columns: ColumnDef<Employee.Default>[] = [
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
      id: "department",
      accessorFn: (row) => row.department?.name,
      header: "Departemen",
      cell: ({ row }) => {
        const department = row.getValue("department") as string;
        return <Badge variant="outline" className="text-sm">{department}</Badge>;
      },
      filterFn: "checkbox" as FilterFnOption<Employee.Default>,
    },
    {
      id: "phone",
      accessorKey: "phone",
      header: "No. HP",
      cell: ({ row }) => {
        const phone = row.getValue("phone");
        return phone ?? "-";
      },
    },
    {
      id: "gender",
      accessorKey: "formatted_gender",
      header: "Gender",
      cell: ({ row }) => {
        const gender = row.getValue("gender") as string;
        return <Badge variant="outline" className="text-sm">{gender}</Badge>;
      },
      filterFn: "radio" as FilterFnOption<Employee.Default>,
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
            <DropdownMenuItem onClick={() => handleDialog("detail", row.original)}>Detail</DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href={route("employee.edit", { id: row.original.id })}
                className="w-full"
              >
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => handleDialog("delete", row.original)}
            >
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // define filter data
  const departmentOptions = departments.map((department) => department.name);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Karyawan" />
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Data Karyawan</h1>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={employees}
          >
            {({ table }) => (
              <DataTableControls table={table}>
                <DataTableFilter
                  table={table}
                  extend={[
                    {
                      id: "department",
                      label: "Departemen",
                      data: departmentOptions,
                    },
                    {
                      id: "gender",
                      label: "Gender",
                      data: ["Pria", "Wanita"],
                    },
                  ]}
                />
                <Button
                  className="ms-auto"
                  asChild
                >
                  <Link href={route("employee.create")}>Tambah Karyawan</Link>
                </Button>
              </DataTableControls>
            )}
          </DataTable>
        </CardContent>
      </Card>
      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      >
        <DialogContent
          className={cn("w-fit min-w-110", dialogType === "delete" && "w-110")}
          onOpenAutoFocus={(e) => e.preventDefault()}
          tabIndex={-1}
          noClose
        >
          {dialogType === "delete" && selectedRow && (
            <EmployeeDelete
              employee={selectedRow}
              onClose={handleDialogClose}
            />
          )}
          {dialogType === "detail" && selectedRow && (
            <EmployeeShow
              data={selectedRow}
              onClose={handleDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
