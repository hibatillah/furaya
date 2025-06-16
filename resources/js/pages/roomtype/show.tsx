import { DataList } from "@/components/data-list";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

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
