import { DataList } from "@/components/data-list";
import { ImageContainer } from "@/components/image";
import TextLink from "@/components/text-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { formatCurrency } from "@/lib/utils";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { ImageOffIcon } from "lucide-react";

export default function RoomTypeShow(props: { roomType: RoomType.Default }) {
  const { roomType } = props;

  // define breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Tipe Kamar",
      href: route("roomtype.index"),
    },
    {
      title: "Detail",
      href: route("roomtype.show", { id: roomType.id }),
    },
  ];

  // define data list
  const dataList = [
    {
      label: "Nama",
      value: roomType.name,
    },
    {
      label: "Kapasitas",
      value: `${roomType.capacity} orang`,
    },
    {
      label: "Tipe Tarif",
      value: roomType.rate_type?.name ?? "-",
    },
    {
      label: "Tarif Dasar",
      value: roomType.base_rate ? formatCurrency(roomType.base_rate as number) : "-",
    },
    {
      label: "Luas Kamar",
      value: roomType.size ? (
        <span className="after:text-foreground relative after:absolute after:-end-2 after:top-0 after:text-[8px] after:content-['2']">
          {roomType.size} m
        </span>
      ) : (
        "-"
      ),
    },
    {
      label: "Jumlah Digunakan",
      value: roomType.rooms_count ? `${roomType.rooms_count} kamar` : "-",
    },
    {
      label: "Jumlah Fasilitas",
      value: `${roomType.facilities_count} jenis`,
    },
    {
      label: "Fasilitas",
      value: roomType.facility?.length && roomType.facility?.length > 0 ? roomType.facility?.map((facility) => facility.name).join(", ") : "-",
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Detail Tipe Kamar ${roomType.name}`} />
      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl font-bold">Detail Tipe Kamar</h1>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 lg:grid-cols-[40%_1fr]">
          <DataList
            data={dataList}
            className="*:data-[label=Fasilitas]:col-span-2 *:data-[value=Fasilitas]:col-span-2 *:data-[value=Fasilitas]:text-wrap"
          />
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="images"
              className="text-muted-foreground"
            >
              Gambar
            </Label>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {roomType.formatted_images && roomType.formatted_images.length > 0 ? (
                roomType.formatted_images.map((image, index) => (
                  <ImageContainer
                    key={index}
                    src={image}
                    alt={roomType.name}
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
                    <p className="text-muted-foreground">Tipe kamar {roomType.name} belum memiliki gambar.</p>
                    <TextLink href={route("roomtype.edit", { id: roomType.id })}>Tambahkan Gambar</TextLink>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
