import { DataList } from "@/components/data-list";
import { ImageContainer } from "@/components/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { cn, formatCurrency } from "@/lib/utils";
import { roomConditionBadgeColor, roomStatusBadgeColor } from "@/static/room";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { useMemo } from "react";

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
        className={cn("border-secondary-foreground/20 dark:border-secondary-foreground/10 rounded-full font-medium", className)}
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
    { label: "Harga", value: formatCurrency(room.price || 0) },
    { label: "Kapasitas", value: `${room.capacity} orang` },
    { label: "View", value: room.view ?? "-" },
    { label: "Status Kamar", value: <BadgeData className={roomStatusBadgeColor[room.status as Enum.RoomStatus]}>{room.status}</BadgeData> },
    {
      label: "Kondisi",
      value: <BadgeData className={cn("capitalize", roomConditionBadgeColor[room.condition as Enum.RoomCondition])}>{room.condition}</BadgeData>,
    },
    { label: "Tipe Kamar", value: <BadgeData>{room.room_type?.name}</BadgeData> },
    { label: "Tipe Tempat Tidur", value: <BadgeData>{room.bed_type?.name}</BadgeData> },
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
        <CardContent className="grid gap-5 lg:grid-cols-2">
          <DataList
            data={dataList}
            className="h-fit *:data-[label=Fasilitas]:col-span-full *:data-[value=Fasilitas]:col-span-full xl:[--columns:2]"
          />
          <dl className="[&_dt]:text-foreground/70">
            <div className="flex flex-col gap-2">
              <dt>Foto Kamar</dt>
              <dd className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
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
          </dl>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
