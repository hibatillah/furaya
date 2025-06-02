import { DataList } from "@/components/data-list";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export default function FacilityShow(props: { data: Facility.Default; onClose: () => void }) {
  const { data, onClose } = props;

  const dataList = [
    {
      label: "Nama",
      value: data.name,
    },
    {
      label: "Jumlah Digunakan",
      value: data.rooms_count,
    },
    {
      label: "Deskripsi",
      value: data.description,
    },
  ];

  return (
    <>
      <DialogHeader>
        <DialogTitle>Detail Fasilitas</DialogTitle>-
      </DialogHeader>
      <Separator />
      <DataList
        data={dataList}
        className="*:data-[label=Deskripsi]:col-span-2 *:data-[label=Deskripsi]:mt-1 *:data-[value=Deskripsi]:col-span-2"
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
