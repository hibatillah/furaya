import { DataTable, DataTableControls } from "@/components/data-table";
import { DataTableFilter } from "@/components/data-table/data-table-filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { ColumnDef, FilterFnOption } from "@tanstack/react-table";
import { PencilIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Kamar",
    href: route("room.index"),
  },
];

export default function RoomsIndex(props: { rooms: Pagination<Room.Default>; roomTypes: RoomType.Default[]; bedTypes: BedType.Default[] }) {
  const { rooms, roomTypes, bedTypes } = props;
  const { delete: deleteRoom } = useForm();

  // handle delete each room
  function handleDelete(e: React.FormEvent, id: string) {
    e.preventDefault();

    toast.loading("Menghapus kamar...", { id: `delete-${id}` });
    deleteRoom(route("room.destroy", { id }), {
      onSuccess: () => toast.success("Kamar berhasil dihapus", { id: `delete-${id}` }),
      onError: () => toast.error("Kamar gagal dihapus", { id: `delete-${id}` }),
    });
  }

  // define data table columns
  const columns: ColumnDef<Room.Default>[] = [
    {
      id: "room_number",
      accessorKey: "room_number",
      header: "Nomor Kamar",
    },
    {
      id: "floor_number",
      accessorKey: "floor_number",
      header: "Lantai",
      filterFn: "checkbox" as FilterFnOption<Room.Default>,
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
        <div className="flex items-center gap-1.5">
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
      <Head title="Kamar" />
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Data Kamar</h1>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={rooms.data}
          >
            {({ table }) => (
              <DataTableControls table={table}>
                <DataTableFilter
                  table={table}
                  extend={[
                    {
                      id: "floor_number",
                      label: "Lantai",
                    },
                    {
                      id: "room_type",
                      label: "Tipe Kamar",
                      data: roomTypes.map((item) => item.name),
                    },
                    {
                      id: "bed_type",
                      label: "Tipe Kasur",
                      data: bedTypes.map((item) => item.name),
                    },
                  ]}
                />
                <Button
                  className="ms-auto w-fit"
                  asChild
                >
                  <Link href={route("room.create")}>Tambah Kamar</Link>
                </Button>
              </DataTableControls>
            )}
          </DataTable>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
