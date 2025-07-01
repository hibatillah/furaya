import { dateConfig } from "@/static";
import { format } from "date-fns";
import CardChart from "./card-chart";

export default function ReservationCard(props: {
  daily?: Record<string, number>;
  monthly?: Record<string, number>;
  roomType?: Record<string, number>;
  guest?: Record<string, number>;
}) {
  const { daily, monthly, roomType, guest } = props;

  const today = new Date();
  const currentMonth = today.getMonth();
  const formatMonthYear = format(today, "MMMM yyyy", dateConfig);

  const dataToUse = daily || {};

  const countCurrentReservation = Object.entries(monthly ?? {}).find(([key, _]) => {
    const month = new Date(key).getMonth();
    return month === currentMonth;
  });

  const highestReservationDate = Object.entries(dataToUse).reduce(
    (max, [key, value]) => {
      return value > max.value ? { date: key, value } : max;
    },
    { date: "", value: 0 },
  );

  const highestReservationGuest = Object.entries(guest ?? {}).reduce(
    (max, [key, value]) => {
      return value > max.value ? { guest: key, value } : max;
    },
    { guest: "", value: 0 },
  );

  const highestRoomType = Object.entries(roomType ?? {}).reduce(
    (max, [key, value]) => {
      return value > max.value ? { roomType: key, value } : max;
    },
    { roomType: "", value: 0 },
  );

  return (
    <div className="col-span-full grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <CardChart
        title="Total Reservasi"
        value={countCurrentReservation?.[1] ?? 0}
        description={formatMonthYear}
      />
      <CardChart
        title="Reservasi Tertinggi"
        value={highestReservationDate.value}
        description={highestReservationDate.date ? format(highestReservationDate.date, "dd MMMM yyyy", dateConfig) : undefined}
      />
      <CardChart
        title="Tamu Reservasi Terpopuler"
        value={highestReservationGuest.value}
        description={highestReservationGuest.guest}
      />
      <CardChart
        title="Tipe Kamar Terpopuler"
        value={highestRoomType.value}
        description={highestRoomType.roomType}
      />
    </div>
  );
}
