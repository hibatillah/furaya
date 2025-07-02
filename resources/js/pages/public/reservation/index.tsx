import { ImageContainer } from "@/components/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import GuestLayout from "@/layouts/guest-layout";
import { formatCurrency } from "@/lib/utils";
import { dateConfig } from "@/static";
import { EMAIL_CONTACT, PHONE_CONTACT } from "@/static/contact";
import { Head, router } from "@inertiajs/react";
import { format } from "date-fns";
import { MailIcon, Maximize2Icon, PhoneIcon, TriangleAlertIcon, UsersRoundIcon } from "lucide-react";

export default function PublicReservationIndex(props: { roomTypes: RoomType.Default[]; startDate: string; endDate: string }) {
  const { roomTypes, startDate, endDate } = props;

  const formatStartDate = format(new Date(startDate), "dd MMMM yyyy", dateConfig);
  const formatEndDate = format(new Date(endDate), "dd MMMM yyyy", dateConfig);

  function handleSelectRoom(roomTypeId: string) {
    router.visit(route("public.reservation.create"), {
      data: {
        room_type_id: roomTypeId,
        start_date: startDate,
        end_date: endDate,
        adults: 1,
        children: 0,
      },
    });
  }

  return (
    <GuestLayout>
      <Head title="Kamar Tersedia" />
      <div className="container mx-auto space-y-5 px-5 pb-10">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Kamar Tersedia</h1>
          <p className="text-muted-foreground">
            List kamar yang tersedia untuk tanggal {formatStartDate} - {formatEndDate}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {roomTypes.length > 0 ? (
            roomTypes.map((roomType) => (
              <Card
                key={roomType.id}
                className="bg-card gap-0 rounded-lg border p-0"
              >
                <CardHeader className="p-0">
                  <ImageContainer
                    src={roomType.formatted_images?.[0] ?? ""}
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
                      variant="default"
                      size="sm"
                      onClick={() => handleSelectRoom(roomType.id)}
                    >
                      Pilih Kamar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex h-[40vh] items-center justify-center">
              <Alert
                className="w-fit"
                variant="primary"
              >
                <TriangleAlertIcon className="size-4" />
                <AlertTitle className="tracking-wide">
                  Tidak ada kamar tersedia untuk tanggal {formatStartDate} - {formatEndDate}
                </AlertTitle>
                <AlertDescription>
                  <p>Silakan pilih tanggal lainnya atau hubungi kami.</p>
                  <div className="text-card-foreground/80 *:hover:text-card-foreground mt-2 flex items-center gap-4 *:hover:underline *:hover:underline-offset-2">
                    <a
                      href={`tel:${PHONE_CONTACT}`}
                      target="_blank"
                      className="flex items-center gap-1"
                    >
                      <PhoneIcon className="text-muted-foreground size-[14px]" />
                      <span>{PHONE_CONTACT}</span>
                    </a>

                    <a
                      href={`mailto:${EMAIL_CONTACT}`}
                      target="_blank"
                      className="flex items-center gap-1"
                    >
                      <MailIcon className="text-muted-foreground size-4" />
                      <span>{EMAIL_CONTACT}</span>
                    </a>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </div>
    </GuestLayout>
  );
}
