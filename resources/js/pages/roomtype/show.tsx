import { DataList } from "@/components/data-list";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export default function RoomTypeShow(props: { data: RoomType.Default; onClose: () => void }) {
  const { data, onClose } = props;

  const dataList = [
    {
      label: "Nama",
      value: data.name,
    },
    {
      label: "Kapasitas",
      value: data.capacity,
    },
    {
      label: "Tarif Dasar",
      value: data.base_rate,
    },
    {
      label: "Jumlah Digunakan",
      value: data.rooms_count,
    },
    {
      label: "Jumlah Fasilitas",
      value: data.facilities_count,
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
        className="*:data-[value=Fasilitas]:text-wrap *:data-[value=Fasilitas]:col-span-2 *:data-[label=Fasilitas]:col-span-2"
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
