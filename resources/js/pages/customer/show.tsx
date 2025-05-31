import { DataList } from "@/components/data-list";
import { DataTable, DataTableControls } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";

export default function CustomerShow(props: { customer: Customer.Default; reservations: Reservation.Default[] }) {
  const { customer, reservations } = props;

  // define page breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Customer",
      href: route("customer.index"),
    },
    {
      title: "Detail",
      href: route("customer.show", { id: customer.id }),
    },
  ];

  // define data list
  const dataList = [
    { label: "Nama", value: customer.user?.name },
    { label: "NIK/Passport", value: customer.nik_passport },
    { label: "Email", value: customer.user?.email },
    { label: "No. HP", value: customer.phone },
    { label: "Gender", value: customer.formatted_gender },
    { label: "Tanggal Lahir", value: customer.formatted_birthdate },
    { label: "Profesi", value: customer.profession },
    { label: "Kewarganegaraan", value: customer.nationality },
    { label: "Alamat", value: customer.address },
  ];

  // define data table columns
  const columns: ColumnDef<Reservation.Default>[] = [
    {
      id: "booking_number",
      header: "No. Reservasi",
      accessorKey: "booking_number",
    },
    {
      id: "room",
      header: "Kamar",
      accessorKey: "room.room_number",
    },
    {
      id: "check_in",
      header: "Check In",
      accessorKey: "check_in",
    },
    {
      id: "check_out",
      header: "Check Out",
      accessorKey: "check_out",
    },
    {
      id: "length_of_stay",
      header: "Durasi",
      accessorKey: "length_of_stay",
    },
    {
      id: "total_price",
      header: "Total Harga",
      accessorKey: "total_price",
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
    },
    {
      id: "action",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          asChild
        >
          <Link href={route("reservation.show", { id: row.original.id })}>Detail</Link>
        </Button>
      ),
    },
  ];
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Detail Customer" />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Detail Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <DataList
            data={dataList}
            className="[--columns:2]"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Riwayat Reservasi Customer</h2>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={reservations}
          >
            {({ table }) => <DataTableControls table={table} />}
          </DataTable>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
