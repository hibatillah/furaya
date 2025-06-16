import { DataList } from "@/components/data-list";
import { DataTable, DataTableControls } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { reservationColumns } from "../reservation";

export default function GuestShow(props: { guest: Guest.Default; reservations: Reservation.Default[] }) {
  const { guest, reservations } = props;

  // define page breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Tamu",
      href: route("guest.index"),
    },
    {
      title: "Detail",
      href: route("guest.show", { id: guest.id }),
    },
  ];

  // define data list for guest detail
  const dataList = [
    { label: "Nama", value: guest.user?.name },
    { label: "NIK/Passport", value: guest.nik_passport },
    { label: "Email", value: guest.user?.email },
    { label: "No. HP", value: guest.phone },
    { label: "Gender", value: guest.formatted_gender },
    { label: "Tanggal Lahir", value: guest.formatted_birthdate },
    { label: "Profesi", value: guest.profession },
    { label: "Kewarganegaraan", value: guest.nationality },
    { label: "Alamat", value: guest.address },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tamu" />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Detail Tamu</CardTitle>
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
          <h2 className="text-xl font-bold">Riwayat Reservasi Tamu</h2>
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
