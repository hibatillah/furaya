import { ImageContainer } from "@/components/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import GuestLayout from "@/layouts/guest-layout";
import { cn, formatCurrency } from "@/lib/utils";
import { reservationStatusBadgeColor } from "@/static/reservation";
import { Head } from "@inertiajs/react";
import { CalendarX2Icon, SearchIcon } from "lucide-react";

export default function ReservationHistory({ reservations }: { reservations: Reservation.Default[] }) {
  return (
    <GuestLayout bookCard={false}>
      <Head title="Riwayat Reservasi" />

      <div className="container mx-auto space-y-4 p-4">
        <div className="flex max-lg:flex-col lg:items-end justify-between gap-5">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Riwayat Reservasi</h1>
            <p className="text-muted-foreground">Lihat riwayat reservasi Anda di sini.</p>
          </div>

          <div className="relative">
            <Input
              type="search"
              placeholder="Cari reservasi"
              className="w-full lg:w-80 pe-8 not-dark:bg-white"
            />
            <div className="pointer-events-none absolute inset-y-0 end-3 flex items-center select-none">
              <SearchIcon className="text-foreground size-4" />
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
                  <CardHeader className="flex flex-row items-center gap-3">
                    <CardTitle className="text-card-foreground/90 font-light">{reservation.booking_number}</CardTitle>
                    <Badge
                      variant="outline"
                      className={cn("capitalize", reservationStatusBadgeColor[reservation.status])}
                    >
                      {reservation.status}
                    </Badge>
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
                  className="size-60 max-lg:mx-auto max-lg:mb-2 lg:me-8 lg:size-44"
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
