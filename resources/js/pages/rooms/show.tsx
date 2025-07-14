import { DataList } from "@/components/data-list";
import { ImageContainer } from "@/components/image";
import TextLink from "@/components/text-link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { cn, formatCurrency } from "@/lib/utils";
import { roomConditionBadgeColor, roomStatusBadgeColor, smokingTypeBadgeColor } from "@/static/room";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { ImageOffIcon } from "lucide-react";
import { useMemo } from "react";

export default function RoomShow(props: { room: Room.Default; reservations: Reservation.Default[] }) {
  const { room } = props;

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

  const getFacilityList = useMemo(() => {
    if (!room.facility) return "-";
    return room.facility.map((facility) => facility.facility?.name).join(", ");
  }, [room.facility]);

  // define data list for room detail
  const dataList = [
    {
      label: "Nomor Kamar",
      value: room.room_number,
    },
    {
      label: "Lantai",
      value: room.floor_number,
    },
    {
      label: "Harga",
      value: formatCurrency(room.price || 0),
    },
    {
      label: "Kapasitas",
      value: `${room.capacity} orang`,
    },
    {
      label: "Luas Kamar",
      value: room.size ? (
        <span className="after:text-foreground relative after:absolute after:-end-2 after:top-0 after:text-[8px] after:content-['2']">
          {room.size} m
        </span>
      ) : (
        "-"
      ),
    },
    {
      label: "View",
      value: room.view ?? "-",
    },
    {
      label: "Jumlah Fasilitas",
      value: room.count_facility ?? 0,
    },
    {
      label: "Status Kamar",
      value: <Badge className={roomStatusBadgeColor[room.status]}>{room.status}</Badge>,
    },
    {
      label: "Kondisi",
      value: <Badge className={cn("capitalize", roomConditionBadgeColor[room.condition])}>{room.condition}</Badge>,
    },
    {
      label: "Tipe Kamar",
      value: <Badge variant="outline">{room.room_type?.name}</Badge>,
    },
    {
      label: "Tipe Kasur",
      value: <Badge variant="outline">{room.bed_type?.name}</Badge>,
    },
    {
      label: "Smoking Type",
      value: <Badge className={cn("capitalize", smokingTypeBadgeColor[room.smoking_type])}>{room.smoking_type}</Badge>,
    },
    {
      label: "Fasilitas",
      value: getFacilityList,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Detail Kamar" />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Detail Kamar</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 lg:grid-cols-[40%_1fr]">
          <DataList
            data={dataList}
            className="h-fit *:data-[label=Fasilitas]:col-span-full *:data-[value=Fasilitas]:col-span-full"
          />
          <dl className="[&_dt]:text-foreground/70 space-y-5">
            <div>
              <dt>Denah Kamar</dt>
              <dd>
                <ImageContainer
                  src={room.formatted_room_layout_image}
                  alt={`Denah Kamar ${room.room_number}`}
                  className="h-40 w-full sm:h-60"
                  imgClassName="object-contain bg-center"
                  href={room.formatted_room_layout_image}
                />
              </dd>
            </div>

            <div className="flex flex-col gap-2">
              <dt>Foto Kamar</dt>
              <dd className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {room.formatted_images && room.formatted_images.length > 0 ? (
                  room.formatted_images.map((image, i) => (
                    <ImageContainer
                      key={i}
                      src={image}
                      alt={`Foto Kamar ${room.room_number}`}
                      className="h-40 w-full sm:h-60 lg:h-40"
                      href={image}
                    />
                  ))
                ) : (
                  <div className="col-span-full flex h-60 flex-col items-center justify-center gap-3 rounded-md border">
                    <ImageOffIcon className="text-primary size-8 stroke-[1.5]" />
                    <div
                      className="text-center"
                      text-sm
                    >
                      <p className="text-muted-foreground">Kamar {room.room_number} belum memiliki gambar.</p>
                      <TextLink href={route("room.edit", { id: room.id })}>Tambahkan Gambar</TextLink>
                    </div>
                  </div>
                )}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
