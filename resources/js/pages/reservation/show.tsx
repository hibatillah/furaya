import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";

export default function ReservationsShow(props: { reservation: Reservation.Default }) {
  const { reservation } = props;
  console.log(reservation);

  const breadcrumbs = [
    {
      label: "Reservasi",
      href: route("reservation.index"),
      title: "Reservasi",
    },
    {
      label: "Detail Reservasi",
      href: route("reservation.show", { id: reservation.id }),
      title: "Detail Reservasi",
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Detail Reservasi" />
      <h1 className="text-2xl font-bold">Detail Reservasi</h1>
    </AppLayout>
  );
}
