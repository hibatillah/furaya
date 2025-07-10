import InputError from "@/components/input-error";
import Multiselect from "@/components/multiselect";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Option } from "@/components/ui/multiselect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UploadFile from "@/components/upload-file";
import { FileMetadata, useFileUpload } from "@/hooks/use-file-upload";
import AppLayout from "@/layouts/app-layout";
import { fetchImageMetadata, formatCurrency } from "@/lib/utils";
import { roomStatusOptions } from "@/static/room";
import { BreadcrumbItem } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

export default function RoomsEdit(props: {
  room: Room.Default;
  roomTypes: RoomType.Default[];
  bedTypes: BedType.Default[];
  roomConditions: Enum.RoomCondition[];
  facilities: Facility.Default[];
  roomStatuses: Enum.RoomStatus[];
  rateTypes: RateType.Default[];
  smokingTypes: Enum.SmokingType[];
}) {
  const { room, roomTypes, bedTypes, roomConditions, facilities, roomStatuses, rateTypes, smokingTypes } = props;
  const { room_type, bed_type, rate_type, facility: roomFacility, count_facility, images, ...rest } = room;

  // define breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Kamar",
      href: route("room.index"),
    },
    {
      title: "Edit",
      href: route("room.edit", { id: room.id }),
    },
  ];

  // define facility options for multiselect form
  const facilityOptions = useMemo(() => {
    return facilities.map((facility) => ({
      value: facility.id,
      label: facility.name,
    }));
  }, [facilities]);

  // declare form
  const initialFacilities = useMemo(() => {
    if (roomFacility && roomFacility.length > 0) {
      return roomFacility.map((item) => ({
        value: item.facility?.id ?? "",
        label: item.facility?.name ?? "",
      }));
    }
    return [];
  }, [roomFacility]);

  const [selectedFacilities, setSelectedFacilities] = useState<Option[]>(initialFacilities);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType.Default | null>(room_type ?? null);
  const isFirstRender = useRef(true);

  const { data, setData, post, processing, errors } = useForm<Room.Update>({
    ...rest,
    status: Object.entries(roomStatusOptions).find(([_, value]) => value === room.status)?.[0] as Enum.RoomStatus,
    facilities: initialFacilities.length > 0 ? initialFacilities.map((item) => item.value) : [],
    room_layout: null,
  });

  // handle change room type
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (selectedRoomType) {
      setData("price", selectedRoomType.base_rate || "");
      setData("capacity", selectedRoomType.capacity || "");
      setData("size", selectedRoomType.size || "");
      setSelectedFacilities(
        selectedRoomType.facility?.map((item) => ({
          value: item.id,
          label: item.name,
        })) ?? [],
      );
    }
  }, [selectedRoomType]);

  // set initial images
  const [initialImageMetadata, setInitialImageMetadata] = useState<FileMetadata[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      if (!room?.formatted_images) return;

      const metadata = await fetchImageMetadata(room.formatted_images);
      setInitialImageMetadata(metadata);
      fileUploadActions.addFiles(metadata.map((item) => item.file as File));
    };

    loadImages();
  }, [room?.formatted_images]);

  // handle file upload
  const [fileUploadState, fileUploadActions] = useFileUpload({
    accept: "image/*",
    maxSize: 5 * 1024 * 1024,
    multiple: true,
    maxFiles: 6,
    initialFiles: initialImageMetadata.map((item) => ({
      name: item.name,
      size: item.size,
      type: item.type,
      url: item.url,
      id: item.id,
    })),
  });

  useEffect(() => {
    setData(
      "images",
      fileUploadState.files.map((file) => file.file as File),
    );
  }, [fileUploadState.files]);

  // set initial room layout
  const [initialRoomLayoutMetadata, setInitialRoomLayoutMetadata] = useState<FileMetadata[]>([]);

  useEffect(() => {
    const loadRoomLayout = async () => {
      if (!room?.formatted_room_layout_image) return;

      const metadata = await fetchImageMetadata([room.formatted_room_layout_image]);
      setInitialRoomLayoutMetadata(metadata);
      layoutFileUploadActions.addFiles(metadata.map((item) => item.file as File));
    };

    loadRoomLayout();
  }, [room?.formatted_room_layout_image]);

  // handle room layout file upload
  const [layoutFileUploadState, layoutFileUploadActions] = useFileUpload({
    accept: "image/*",
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    initialFiles: initialRoomLayoutMetadata.map((item) => ({
      name: item.name,
      size: item.size,
      type: item.type,
      url: item.url,
      id: item.id,
    })),
  });

  useEffect(() => {
    setData("room_layout", layoutFileUploadState.files[0]?.file as File);
  }, [layoutFileUploadState.files]);

  // handle update room
  function handleUpdateRoom(e: React.FormEvent) {
    e.preventDefault();

    // sent data
    toast.loading("Mengubah kamar...", { id: "update-room" });

    post(route("room.update", { id: room.id }), {
      method: "put",
      forceFormData: true,
      onError: (errors) => {
        toast.warning("Kamar gagal diubah", {
          id: "update-room",
          description: errors.message,
        });
      },
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Kamar" />
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Edit Kamar</h1>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleUpdateRoom}
            className="grid gap-x-8 gap-y-6 lg:grid-cols-2 xl:grid-cols-3"
          >
            {/* room number */}
            <div className="grid gap-2">
              <Label
                htmlFor="room_number"
                required
              >
                Nomor Kamar
              </Label>
              <Input
                id="room_number"
                type="number"
                min={1}
                value={data.room_number}
                onChange={(e) => setData("room_number", parseInt(e.target.value))}
                placeholder="Nomor Kamar"
                disableHandle
                required
              />
              <InputError message={errors.room_number} />
            </div>

            {/* floor number */}
            <div className="grid gap-2">
              <Label
                htmlFor="floor_number"
                required
              >
                Nomor Lantai
              </Label>
              <Input
                id="floor_number"
                type="number"
                min={1}
                value={data.floor_number}
                onChange={(e) => setData("floor_number", parseInt(e.target.value))}
                disableHandle
                required
                placeholder="Nomor Lantai"
              />
              <InputError message={errors.floor_number} />
            </div>

            {/* room type */}
            <div className="grid gap-2">
              <Label
                htmlFor="room_type_id"
                required
              >
                Tipe Kamar
              </Label>
              <Select
                value={data.room_type_id}
                onValueChange={(value) => {
                  const roomType = roomTypes.find((type) => type.id === value);

                  setData("room_type_id", value);
                  setData("rate_type_id", roomType?.rate_type_id || "");
                  setSelectedRoomType(roomType ?? null);

                  // assign facilities
                  setData("facilities", roomType?.facility?.map((item) => item.id) ?? []);
                  setSelectedFacilities(
                    roomType?.facility?.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })) ?? [],
                  );
                }}
                disabled={roomTypes.length === 0}
                required
              >
                <SelectTrigger id="room_type_id">
                  <SelectValue placeholder="Pilih Tipe Kamar">
                    <span className="capitalize">{roomTypes.find((type) => type.id === data.room_type_id)?.name}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((type) => (
                    <SelectItem
                      key={type.id}
                      value={type.id}
                      className="capitalize"
                    >
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.room_type_id} />
            </div>

            {/* bed type */}
            <div className="grid gap-2">
              <Label
                htmlFor="bed_type_id"
                required
              >
                Tipe Kasur
              </Label>
              <Select
                value={data.bed_type_id}
                onValueChange={(value) => setData("bed_type_id", value)}
                disabled={bedTypes.length === 0}
                required
              >
                <SelectTrigger id="bed_type_id">
                  <SelectValue placeholder="Pilih Tipe Kasur">
                    <span className="capitalize">{bedTypes.find((type) => type.id === data.bed_type_id)?.name}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {bedTypes.map((type) => (
                    <SelectItem
                      key={type.id}
                      value={type.id}
                      className="capitalize"
                    >
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.bed_type_id} />
            </div>

            {/* rate type */}
            <div className="grid gap-2">
              <Label
                htmlFor="rate_type_id"
                required
              >
                Tipe Tarif
              </Label>
              <Select
                value={data.rate_type_id}
                onValueChange={(value) => {
                  setData("rate_type_id", value);
                  setData("price", rateTypes.find((type) => type.id === value)?.rate || "");
                }}
                disabled={rateTypes.length === 0}
                required
              >
                <SelectTrigger id="rate_type_id">
                  <SelectValue placeholder="Pilih Tipe Tarif">
                    <span className="capitalize">{rateTypes.find((type) => type.id === data.rate_type_id)?.name}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {rateTypes.map((type) => (
                    <SelectItem
                      key={type.id}
                      value={type.id}
                    >
                      {type.code} - {formatCurrency(Number(type.rate))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.rate_type_id} />
            </div>

            {/* price */}
            <div className="grid gap-2">
              <Label
                htmlFor="price"
                required
              >
                Harga
              </Label>
              <div className="relative">
                <Input
                  id="price"
                  type="number"
                  min={1}
                  step="any"
                  value={data.price}
                  onChange={(e) => setData("price", parseInt(e.target.value))}
                  className="ps-8"
                  placeholder="Harga"
                  disableHandle
                  required
                />
                <span className="text-muted-foreground absolute inset-y-0 start-2 flex items-center text-sm">Rp</span>
              </div>
              <InputError message={errors.price} />
            </div>

            {/* condition */}
            <div className="grid gap-2">
              <Label
                htmlFor="condition"
                required
              >
                Kondisi
              </Label>
              <Select
                value={data.condition}
                onValueChange={(value) => setData("condition", value as Enum.RoomCondition)}
                required
              >
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Pilih Kondisi">
                    <span className="capitalize">{data.condition}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {roomConditions.map((condition) => (
                    <SelectItem
                      key={condition}
                      value={condition}
                      className="capitalize"
                    >
                      {condition}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.condition} />
            </div>

            {/* capacity */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="capacity"
                required
              >
                Kapasitas
              </Label>
              <div className="relative">
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  value={data.capacity}
                  onChange={(e) => setData("capacity", parseInt(e.target.value))}
                  disableHandle
                  required
                  placeholder="Kapasitas"
                />
                <span className="text-muted-foreground absolute inset-y-0 end-3 flex items-center text-sm">Orang</span>
              </div>
              <InputError message={errors.capacity} />
            </div>

            {/* status */}
            <div className="grid gap-2">
              <Label
                htmlFor="status"
                required
              >
                Status
              </Label>
              <Select
                value={data.status}
                onValueChange={(value) => setData("status", value as Enum.RoomStatus)}
                required
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Pilih Status">
                    <span className="uppercase">{data.status}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {roomStatuses.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="uppercase"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.condition} />
            </div>
            {/* size */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="size"
                required
              >
                Luas Kamar
              </Label>
              <div className="relative">
                <Input
                  id="size"
                  type="number"
                  value={data.size}
                  placeholder="Input luas kamar"
                  onChange={(e) => setData("size", parseInt(e.target.value))}
                  autoComplete="off"
                  disableHandle
                  required
                />
                <span className="text-muted-foreground absolute inset-y-0 end-4 flex items-center after:absolute after:-end-1.5 after:top-1 after:text-[8px] after:content-['2']">
                  m
                </span>
              </div>
              <InputError message={errors.size} />
            </div>

            {/* smoking type */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="smoking_type"
                required
              >
                Smoking Type
              </Label>
              <Select
                value={data.smoking_type}
                onValueChange={(value) => setData("smoking_type", value as Enum.SmokingType)}
                required
              >
                <SelectTrigger id="smoking_type">
                  <SelectValue placeholder="Pilih Smoking Type" />
                </SelectTrigger>
                <SelectContent>
                  {smokingTypes.map((type) => (
                    <SelectItem
                      key={type}
                      value={type}
                      className="capitalize"
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.smoking_type} />
            </div>

            {/* view */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="view">View</Label>
              <Input
                id="view"
                type="text"
                value={data.view}
                placeholder="View"
                onChange={(e) => setData("view", e.target.value)}
                disableHandle
              />
              <InputError message={errors.view} />
            </div>

            {/* facilities */}
            <div className="grid gap-2 xl:col-span-2">
              <Label htmlFor="facilities">Fasilitas</Label>
              <Multiselect
                label="Fasilitas"
                data={facilityOptions}
                value={selectedFacilities}
                onChange={(value) => {
                  setSelectedFacilities(value);
                  setData("facilities", value.length > 0 ? value.map((item) => item.value) : []);
                }}
              />
              <InputError message={errors.facilities} />
            </div>

            <div className="space-y-6 xl:col-start-3 xl:row-span-7 xl:row-start-1">
              {/* layout */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="room_layout">Denah Kamar</Label>
                <UploadFile
                  options={layoutFileUploadState}
                  actions={layoutFileUploadActions}
                />
                <InputError message={errors.room_layout} />
              </div>

              {/* images */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="images">Gambar</Label>
                <UploadFile
                  options={fileUploadState}
                  actions={fileUploadActions}
                  multiple
                />
                <p className="text-muted-foreground text-sm">Gambar tipe kamar terpilih akan ditambahkan sebagai gambar kamar.</p>
                <InputError message={errors.images} />
              </div>
            </div>

            {/* submit */}
            <SubmitButton
              disabled={processing}
              loading={processing}
              loadingText="Menyimpan..."
              className="w-full lg:col-span-full lg:w-fit lg:place-self-end"
            >
              Simpan
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
