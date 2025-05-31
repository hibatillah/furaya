import { DataTable, DataTableControls } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, SharedData } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import { ColumnDef, FilterFnOption } from "@tanstack/react-table";
import { PencilIcon } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Reservasi",
    href: route("reservation.index"),
  },
];

export default function ReservationsIndex() {
  const { auth } = usePage<SharedData>().props;
  const isManager = auth.user.role === "manager";

  // define data table columns
  const columns: ColumnDef<Room.Default>[] = [
    {
      id: "room_number",
      accessorKey: "room_number",
      header: "Nomor Kamar",
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant="secondary"
            className="rounded-full capitalize"
          >
            {status}
          </Badge>
        );
      },
      filterFn: "checkbox" as FilterFnOption<Room.Default>,
    },
    {
      id: "room_type",
      accessorFn: (row) => row.room_type?.name,
      header: "Tipe Kamar",
      cell: ({ row }) => {
        const roomType = row.getValue("room_type") as string;
        return <span className="capitalize">{roomType}</span>;
      },
      filterFn: "checkbox" as FilterFnOption<Room.Default>,
    },
    {
      id: "bed_type",
      accessorFn: (row) => row.bed_type?.name,
      header: "Tipe Kasur",
      cell: ({ row }) => {
        const bedType = row.getValue("bed_type") as string;
        return <span className="capitalize">{bedType}</span>;
      },
      filterFn: "checkbox" as FilterFnOption<Room.Default>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              asChild
            >
              <Link href={route("roomtype.edit", { id: row.original.id })}>
                <PencilIcon className="size-3" />
                <span className="sr-only">Edit Data</span>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit Data</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Reservasi" />
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Data Reservasi</h1>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={[]}
          >
            {({ table }) => (
              <DataTableControls table={table}>
                {!isManager && (
                  <Button
                    className="ms-auto"
                    asChild
                  >
                    <Link href={route("reservation.create")}>Tambah Reservasi</Link>
                  </Button>
                )}
              </DataTableControls>
            )}
          </DataTable>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
