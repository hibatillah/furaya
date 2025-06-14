import { DataList } from "@/components/data-list";
import { DataTable, DataTableControls } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { reservationColumns } from "../reservation";

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

  // define data list for customer detail
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
            columns={reservationColumns}
            data={reservations}
          >
            {({ table }) => <DataTableControls table={table} />}
          </DataTable>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
