import { ImageContainer } from "@/components/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GuestLayout from "@/layouts/guest-layout";
import { cn, formatCurrency } from "@/lib/utils";
import { reservationStatusBadgeColor, transactionStatusBadgeColor } from "@/static/reservation";
import { Head, router } from "@inertiajs/react";
import { BedSingleIcon, CalendarRangeIcon, CalendarX2Icon, MoveDownIcon, MoveUpIcon, SearchIcon, Settings2Icon } from "lucide-react";
import { useState } from "react";

export default function ReservationHistory({
  reservations,
  sort,
  status,
  search,
}: {
  reservations: Reservation.Default[];
  sort: "asc" | "desc";
  status: Enum.ReservationStatus[];
  search: string;
}) {
  const [selectedStatus, setSelectedStatus] = useState<Enum.ReservationStatus>("all" as Enum.ReservationStatus);
  const [searchValue, setSearchValue] = useState<string>(search ?? "");

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
                  search: searchValue,
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
                  search: searchValue,
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
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);

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
                className="grid items-center gap-5 xl:grid-cols-[1fr_auto]"
              >
                <div className="relative flex flex-col gap-5">
                  <CardHeader className="flex flex-col gap-3">
                    <CardTitle className="text-card-foreground/90 font-normal max-lg:text-lg flex">
                      <div className="text-muted-foreground me-2 text-sm">Booking Number</div>
                      <div className="select-all">{reservation.booking_number}</div>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn("capitalize", reservationStatusBadgeColor[reservation.status])}
                      >
                        {reservation.status}
                      </Badge>

                      <Badge
                        variant="outline"
                        className={cn(
                          "capitalize",
                          transactionStatusBadgeColor[reservation.transaction_status as keyof typeof transactionStatusBadgeColor],
                        )}
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

                    <dl className="**:[svg]:text-primary! **:data-[slot=separator]:text-muted-foreground/80 relative space-y-2 **:data-[slot=separator]:mx-2 *:[dd]:flex *:[dd]:items-start *:[dd]:gap-3 *:[dd]:lg:items-center **:[svg]:size-4 **:[svg]:max-lg:mt-[5px]">
                      <dd>
                        <CalendarRangeIcon />
                        <div>
                          {reservation.formatted_start_date} - {reservation.formatted_end_date}
                          <span data-slot="separator">|</span>
                          {reservation.length_of_stay} malam
                        </div>
                      </dd>
                      <dd>
                        <BedSingleIcon />
                        <div>
                          Kamar {reservation.reservation_room?.room_type_name}
                          <span data-slot="separator">|</span>
                          {reservation.adults} dewasa, {reservation.children} anak
                        </div>
                      </dd>
                      <dd>
                        <Settings2Icon />
                        <div className="capitalize">
                          {reservation.smoking_type}
                          <span data-slot="separator">|</span>
                          {reservation.include_breakfast ? "Termasuk Sarapan" : "Tanpa Sarapan"}
                        </div>
                      </dd>
                    </dl>
                  </CardContent>

                  <CardFooter>
                    <span className="text-xl font-semibold">{formatCurrency(Number(reservation.total_price))}</span>
                  </CardFooter>
                </div>

                <ImageContainer
                  src={reservation.reservation_room?.room_type?.formatted_images?.[0] ?? ""}
                  alt={reservation.reservation_room?.room_type_name ?? ""}
                  className="max-lg:mx-auto max-lg:mb-2 max-lg:h-40 max-lg:w-72 lg:mx-auto lg:h-44 lg:w-[90%] xl:me-6 xl:size-52"
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
