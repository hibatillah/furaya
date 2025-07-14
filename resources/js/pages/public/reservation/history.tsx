import { ImageContainer } from "@/components/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GuestLayout from "@/layouts/guest-layout";
import { cn, formatCurrency } from "@/lib/utils";
import { reservationStatusBadgeColor, transactionStatusBadgeColor } from "@/static/reservation";
import { Head, router } from "@inertiajs/react";
import { CalendarX2Icon, MoveDownIcon, MoveUpIcon, SearchIcon } from "lucide-react";
import { useState } from "react";

export default function ReservationHistory({
  reservations,
  sort,
  status,
}: {
  reservations: Reservation.Default[];
  sort: "asc" | "desc";
  status: Enum.ReservationStatus[];
}) {
  const [selectedStatus, setSelectedStatus] = useState<Enum.ReservationStatus>("all" as Enum.ReservationStatus);
  const [search, setSearch] = useState<string>("");

  function handleReservationFilter({ status, sort, search }: { status: Enum.ReservationStatus; sort: "asc" | "desc"; search: string }) {
    setSelectedStatus(status);

    router.get(
      route("public.reservation.history"),
      {
        status,
        sort,
        search,
      },
      {
        preserveState: true,
        preserveScroll: true,
      },
    );
  }

  return (
    <GuestLayout bookCard={false}>
      <Head title="Riwayat Reservasi" />

      <div className="container mx-auto space-y-4 lg:p-4">
        <div className="flex justify-between gap-5 max-lg:flex-col lg:items-end">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Riwayat Reservasi</h1>
            <p className="text-muted-foreground">Lihat riwayat reservasi Anda di sini.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:flex lg:items-center">
            {/* status */}
            <Select
              value={selectedStatus}
              onValueChange={(value) => {
                handleReservationFilter({
                  status: value as Enum.ReservationStatus,
                  sort,
                  search,
                });
              }}
            >
              <SelectTrigger className="bg-card dark:bg-accent">
                <SelectValue placeholder="Status Reservasi">
                  <span className="me-1 capitalize">{selectedStatus === ("all" as Enum.ReservationStatus) ? "Semua Status" : selectedStatus}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {status.map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    className="capitalize"
                  >
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* sort */}
            <Button
              variant="outline"
              className="bg-card dark:bg-accent gap-1.5 !ps-2.5"
              onClick={() => {
                handleReservationFilter({
                  status: selectedStatus,
                  sort: sort === "asc" ? "desc" : "asc",
                  search,
                });
              }}
            >
              {sort === "desc" ? <MoveUpIcon /> : <MoveDownIcon />}
              {sort === "desc" ? "Terbaru" : "Terlama"}
            </Button>

            {/* input search */}
            <div className="relative max-lg:col-span-full max-lg:row-start-1">
              <Input
                type="search"
                placeholder="Cari booking number reservasi"
                className="w-full pe-8 not-dark:bg-white lg:w-64"
                onChange={(e) => {
                  handleReservationFilter({
                    status: selectedStatus,
                    sort,
                    search: e.target.value,
                  });
                }}
              />
              <div className="pointer-events-none absolute inset-y-0 end-3 flex items-center select-none">
                <SearchIcon className="text-foreground size-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {reservations.length > 0 ? (
            reservations.map((reservation) => (
              <Card
                key={reservation.id}
                className="grid items-center gap-8 lg:grid-cols-[1fr_auto]"
              >
                <div className="relative flex flex-col gap-5">
                  <CardHeader className="flex flex-col gap-3">
                    <CardTitle className="text-card-foreground/90 font-normal max-lg:text-lg">{reservation.booking_number}</CardTitle>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn("capitalize", reservationStatusBadgeColor[reservation.status])}
                      >
                        {reservation.status}
                      </Badge>

                      <Badge
                        variant="outline"
                        className={cn("capitalize", transactionStatusBadgeColor[reservation.transaction_status ?? ""])}
                      >
                        {reservation.transaction_status}
                      </Badge>

                      {reservation.payment_type && (
                        <Badge
                          variant="outline"
                          className="capitalize"
                        >
                          {reservation.payment_type}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="grid items-end gap-2">
                    <div>
                      <div>
                        {reservation.formatted_start_date} - {reservation.formatted_end_date}
                      </div>
                      <div className="text-muted-foreground">
                        {reservation.length_of_stay} malam • {reservation.adults} dewasa, {reservation.children} anak
                      </div>
                    </div>

                    <div>
                      <div>
                        {reservation.reservation_room?.room_number ? `No. ${reservation.reservation_room?.room_number} - ` : ""}
                        {reservation.reservation_room?.room_type_name}{" "}
                        {reservation.reservation_room?.bed_type ? ` - ${reservation.reservation_room?.bed_type}` : ""}
                      </div>
                      <div className="text-muted-foreground capitalize">
                        {reservation.smoking_type} • {reservation.include_breakfast ? "Include Breakfast" : "Exclude Breakfast"}
                      </div>
                    </div>

                    <div className="text-xl font-semibold">{formatCurrency(Number(reservation.total_price))}</div>
                  </CardContent>
                </div>

                <ImageContainer
                  src={reservation.reservation_room?.room_type?.formatted_images?.[0] ?? ""}
                  alt={reservation.reservation_room?.room_type_name ?? ""}
                  className="max-lg:mx-auto max-lg:mb-2 max-lg:h-40 max-lg:w-72 lg:me-8 lg:size-44"
                />
              </Card>
            ))
          ) : (
            <div className="col-span-full flex h-[60vh] flex-col items-center justify-center gap-5">
              <CalendarX2Icon className="text-primary size-12 stroke-2" />

              <div className="text-center">
                <h2 className="text-foreground/90 text-lg font-semibold">Tidak Ada Reservasi</h2>
                <p className="text-muted-foreground">Anda belum memiliki reservasi</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GuestLayout>
  );
}
