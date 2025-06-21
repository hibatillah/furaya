import { DataList } from "@/components/data-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency } from "@/lib/utils";
import { smokingTypeBadgeColor } from "@/static/room";

export default function RoomTypeShow(props: { data: RoomType.Default; onClose: () => void }) {
  const { data, onClose } = props;

  const dataList = [
    {
      label: "Nama",
      value: data.name,
    },
    {
      label: "Kapasitas",
      value: `${data.capacity} orang`,
    },
    {
      label: "Tipe Tarif",
      value: data.rate_type?.name ?? "-",
    },
    {
      label: "Tarif Dasar",
      value: data.base_rate ? formatCurrency(data.base_rate as number) : "-",
    },
    {
      label: "Luas Kamar",
      value: data.size ? (
        <span className="after:text-foreground relative after:absolute after:-end-2 after:top-0 after:text-[8px] after:content-['2']">
          {data.size} m
        </span>
      ) : (
        "-"
      ),
    },
    {
      label: "Smoking Type",
      value: <Badge className={cn("capitalize", smokingTypeBadgeColor[data.smoking_type])}>{data.smoking_type}</Badge>,
    },
    {
      label: "Jumlah Digunakan",
      value: data.rooms_count ? `${data.rooms_count} kamar` : "-",
    },
    {
      label: "Jumlah Fasilitas",
      value: `${data.facilities_count} jenis`,
    },
    {
      label: "Fasilitas",
      value: data.facility.length > 0 ? data.facility.map((facility) => facility.name).join(", ") : "-",
    },
  ];

  return (
    <>
      <DialogHeader>
        <DialogTitle>Detail Tipe Kamar</DialogTitle>
      </DialogHeader>
      <Separator />
      <DataList
        data={dataList}
        className="*:data-[label=Fasilitas]:col-span-2 *:data-[value=Fasilitas]:col-span-2 *:data-[value=Fasilitas]:text-wrap"
      />
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={onClose}
        >
          Kembali
        </Button>
      </div>
    </>
  );
}
