import { ImageContainer } from "@/components/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import GuestLayout from "@/layouts/guest-layout";
import { formatCurrency } from "@/lib/utils";
import { dateConfig } from "@/static";
import { Head } from "@inertiajs/react";
import { format } from "date-fns";
import { Maximize2Icon, UsersRoundIcon } from "lucide-react";

export default function PublicReservationIndex(props: { roomTypes: RoomType.Default[]; startDate: string; endDate: string }) {
  const { roomTypes, startDate, endDate } = props;

  const formatStartDate = format(new Date(startDate), "dd MMMM yyyy", dateConfig);
  const formatEndDate = format(new Date(endDate), "dd MMMM yyyy", dateConfig);

  return (
    <GuestLayout>
      <Head title="Reservasi Kamar" />
      <div className="container mx-auto space-y-5 px-5 pb-10">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Reservasi Kamar</h1>
          <p className="text-muted-foreground">
            List kamar yang tersedia untuk tanggal {formatStartDate} - {formatEndDate}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {roomTypes.map((roomType) => (
            <Card
              key={roomType.id}
              className="bg-card gap-0 rounded-lg border p-0"
            >
              <CardHeader className="p-0">
                <ImageContainer
                  src=""
                  alt={roomType.name}
                  className="h-52 w-full"
                />
              </CardHeader>
              <CardContent className="flex w-full flex-row justify-between !p-4">
                <div className="space-y-0.5">
                  <h3 className="text-foreground text-lg font-semibold">{roomType.name}</h3>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <UsersRoundIcon className="text-primary size-3" />
                    up to {roomType.capacity} guests
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Maximize2Icon className="text-primary size-3" />
                    {roomType.size} m <sup className="-ms-1">2</sup>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="flex flex-col items-end">
                    <div className="flex items-end gap-1">
                      <span className="text-muted-foreground text-sm">from</span>
                      {formatCurrency(Number(roomType.base_rate))}
                    </div>
                    <span className="text-muted-foreground text-sm">1 night / {roomType.capacity} guests</span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                  >
                    Pilih Kamar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </GuestLayout>
  );
}
