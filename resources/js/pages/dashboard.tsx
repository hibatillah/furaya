import { ChartCountBedType } from "@/components/charts/count-bed-type";
import { ChartCountRoomType } from "@/components/charts/count-room-type";
import { ChartCountUserRole } from "@/components/charts/count-user-role";
import DashboardTabs, { DashboardTabsData } from "@/components/dashobard-tabs";
import { InputDate } from "@/components/input-date";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { endOfMonth, startOfMonth } from "date-fns";
import { CalendarCheckIcon, CircleDollarSignIcon, EarthIcon, HotelIcon, UsersIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
];

export default function Dashboard({
  userRoleCount,
  roomTypeCount,
  bedTypeCount,
}: {
  userRoleCount: Record<Enum.Role, number>;
  roomTypeCount: Record<string, number>;
  bedTypeCount: Record<string, number>;
}) {
  const firstDateMonth = startOfMonth(new Date());
  const lastDateMonth = endOfMonth(new Date());
  const [dateRange, setDateRange] = useState<DateRange>({
    from: firstDateMonth,
    to: lastDateMonth,
  });

  const data: DashboardTabsData[] = [
    {
      title: "Reservasi",
      icon: CalendarCheckIcon,
      content: (
        <div className="w-full grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <ChartCountUserRole data={userRoleCount} />
          <ChartCountRoomType data={roomTypeCount} />
          <ChartCountBedType data={bedTypeCount} />
        </div>
      ),
    },
    {
      title: "Demografi",
      icon: EarthIcon,
      content: <p>Content for Tab 2</p>,
    },
    {
      title: "Keuangan",
      icon: CircleDollarSignIcon,
      content: <p>Content for Tab 3</p>,
    },
    {
      title: "Karyawan",
      icon: UsersIcon,
      content: <p>Content for Tab 4</p>,
    },
    {
      title: "Kamar",
      icon: HotelIcon,
      content: <p>Content for Tab 5</p>,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="">
        <DashboardTabs
          data={data}
          className="w-full"
        >
          <InputDate
            mode="range"
            value={dateRange}
            onChange={(date) => setDateRange(date as DateRange)}
            className="ms-auto w-56 h-8 border-input/30 bg-card"
            align="end"
          />
        </DashboardTabs>
      </div>
    </AppLayout>
  );
}
