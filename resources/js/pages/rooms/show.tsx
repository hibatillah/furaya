import { DataList } from "@/components/data-list";
import { DataTable, DataTableControls } from "@/components/data-table";
import { ImageContainer } from "@/components/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { cn } from "@/lib/utils";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { useMemo } from "react";
import { reservationColumns } from "../reservation";

export default function RoomShow(props: { room: Room.Default; reservations: Reservation.Default[] }) {
  const { room, reservations } = props;

  // define page breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Kamar",
      href: route("room.index"),
    },
    {
      title: "Detail",
      href: route("room.show", { id: room.id }),
    },
  ];

  // define badge for data
  function BadgeData({ children, className }: { children?: React.ReactNode; className?: string }) {
    if (!children) return "-";
    return (
      <Badge
        variant="secondary"
        className={cn("text-sm", className)}
      >
        {children}
      </Badge>
    );
  }

  const getFacilityList = useMemo(() => {
    if (!room.facility) return "-";
    return room.facility.map((facility) => facility.facility?.name).join(", ");
  }, [room.facility]);

  // define data list for room detail
  const dataList = [
    { label: "Nomor Kamar", value: room.room_number },
    { label: "Lantai", value: room.floor_number },
    { label: "Harga", value: room.price },
    { label: "Kapasitas", value: room.capacity },
    { label: "View", value: room.view ?? "-" },
    { label: "Tipe Kamar", value: <BadgeData>{room.room_type?.name}</BadgeData> },
    { label: "Tipe Tempat Tidur", value: <BadgeData>{room.bed_type?.name}</BadgeData> },
    { label: "Status Kamar", value: <BadgeData>{room.room_status?.status}</BadgeData> },
    { label: "Kondisi", value: <BadgeData className="capitalize">{room.condition}</BadgeData> },
    { label: "Jumlah Fasilitas", value: room.count_facility ?? 0 },
    { label: "Fasilitas", value: getFacilityList },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Detail Kamar" />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Detail Kamar</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          <DataList
            data={dataList}
            className="h-fit *:data-[label=Fasilitas]:col-span-full *:data-[value=Fasilitas]:col-span-full"
          />
          <dd className="[&_dt]:text-foreground/70 xl:col-span-2">
            <div className="flex flex-col gap-2">
              <dt>Foto Kamar</dt>
              <dd className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <ImageContainer
                    key={i}
                    src={""}
                    alt="Denah Kamar"
                    className="size-full"
                  />
                ))}
              </dd>
            </div>
          </dd>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Riwayat Reservasi Kamar</h2>
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
