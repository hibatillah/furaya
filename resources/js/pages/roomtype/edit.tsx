import InputError from "@/components/input-error";
import Multiselect from "@/components/multiselect";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Option } from "@/components/ui/multiselect";
import { useForm } from "@inertiajs/react";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function RoomTypeEdit(props: { data: RoomType.Default; facilities: Facility.Default[]; onClose: () => void }) {
  const { data: roomType, facilities: facilitiesData, onClose } = props;
  const { can_delete, rooms_count, room_type_facility, facilities_count, ...rest } = roomType;

  // define form data
  const { data, setData, put, processing, errors } = useForm<RoomType.Update>({
    ...rest,
    facilities: room_type_facility?.map((item) => item.facility_id),
  });

  // handle selected facilities for multiselect
  const [selectedFacilities, setSelectedFacilities] = useState<Option[]>(
    room_type_facility?.map((item) => ({
      value: item.facility_id,
      label: item.facility?.name || "",
    })) || [],
  );

  // define facility options for multiselect
  const facilityOptions = useMemo(() => {
    return facilitiesData?.map((facility) => ({
      value: facility.id,
      label: facility.name,
    }));
  }, [facilitiesData]);

  // handle update room type data
  function handleUpdateRoomType(e: React.FormEvent) {
    e.preventDefault();

    toast.loading("Memperbarui tipe kamar...", {
      id: `update-room-type-${data.id}`,
    });

    put(route("roomtype.update", { id: data.id }), {
      onSuccess: () => {
        toast.success("Tipe kamar berhasil diperbarui", {
          id: `update-room-type-${data.id}`,
        });
      },
      onError: (error) => {
        toast.error("Tipe kamar gagal diperbarui", {
          id: `update-room-type-${data.id}`,
          description: error.message,
        });
      },
      onFinish: () => onClose(),
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Tipe Kamar</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={handleUpdateRoomType}
        className="space-y-6"
      >
        <div className="grid gap-2">
          <Label htmlFor="name">Nama</Label>
          <Input
            id="name"
            type="text"
            value={data.name}
            placeholder="Nama"
            onChange={(e) => setData("name", e.target.value)}
            required
          />
          <InputError message={errors.name} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="capacity">Kapasitas</Label>
          <Input
            id="capacity"
            type="number"
            value={data.capacity}
            placeholder="Kapasitas"
            onChange={(e) => setData("capacity", parseInt(e.target.value))}
            required
          />
          <InputError message={errors.capacity} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="base_rate">Tarif Dasar</Label>
          <Input
            id="base_rate"
            type="number"
            value={data.base_rate}
            placeholder="Tarif Dasar"
            onChange={(e) => setData("base_rate", parseFloat(e.target.value))}
            required
          />
          <InputError message={errors.base_rate} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="facilities">Fasilitas</Label>
          <Multiselect
            label="Fasilitas"
            data={facilityOptions}
            value={selectedFacilities}
            onChange={(value) => {
              setSelectedFacilities(value);
              setData(
                "facilities",
                value.map((item) => item.value),
              );
            }}
          />
          <InputError message={errors.facilities} />
        </div>

        <Button
          type="submit"
          disabled={processing}
          className="w-full"
        >
          {processing && <Loader2 className="size-4 animate-spin" />}
          Perbarui Tipe Kamar
        </Button>
      </form>
    </>
  );
}
