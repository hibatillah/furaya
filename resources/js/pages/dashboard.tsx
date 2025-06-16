import { ChartCountBedType } from "@/components/charts/count-bed-type";
import { ChartCountRoomType } from "@/components/charts/count-room-type";
import { ChartCountUserRole } from "@/components/charts/count-user-role";
import { ChartMostUsedFacility } from "@/components/charts/most-used-facility";
import DashboardTabs, { DashboardTabsData } from "@/components/dashobard-tabs";
import { InputDate } from "@/components/input-date";
import AppLayout from "@/layouts/app-layout";
import { SharedData, type BreadcrumbItem } from "@/types";
import { Head, usePage } from "@inertiajs/react";
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
  mostUsedFacilityByRoom,
}: {
  userRoleCount: Record<Enum.Role, number>;
  roomTypeCount: Record<string, number>;
  bedTypeCount: Record<string, number>;
  mostUsedFacilityByRoom: Record<string, number>;
}) {
  const { auth } = usePage<SharedData>().props;
  const role = auth.user?.role as Enum.Role;

  const firstDateMonth = startOfMonth(new Date());
  const lastDateMonth = endOfMonth(new Date());
  const [dateRange, setDateRange] = useState<DateRange>({
    from: firstDateMonth,
    to: lastDateMonth,
  });

  let dashboardMenu: DashboardTabsData[] = [
    {
      title: "Reservasi",
      icon: CalendarCheckIcon,
      content: (
        <div className="grid w-full gap-4 lg:grid-cols-2 xl:grid-cols-6">
          <ChartCountUserRole
            data={userRoleCount}
            className="xl:col-span-2"
          />
          <ChartCountRoomType
            data={roomTypeCount}
            className="xl:col-span-2"
          />
          <ChartCountBedType
            data={bedTypeCount}
            className="xl:col-span-2"
          />
        </div>
      ),
    },
    {
      title: "Kamar",
      icon: HotelIcon,
      content: (
        <div className="grid w-full gap-4 xl:grid-cols-3 2xl:grid-cols-3">
          <ChartMostUsedFacility
            data={mostUsedFacilityByRoom}
            className="xl:col-span-2"
          />
          <ChartCountRoomType data={roomTypeCount} />
        </div>
      ),
    },
    {
      title: "Demografi",
      icon: EarthIcon,
      content: <p>Content for Tab Demografi</p>,
    },
    {
      title: "Karyawan",
      icon: UsersIcon,
      content: <p>Content for Tab Karyawan</p>,
    },
    {
      title: "Keuangan",
      icon: CircleDollarSignIcon,
      content: <p>Content for Tab Keuangan</p>,
    },
  ];

  // filter menu based on role
  dashboardMenu = dashboardMenu.filter((item) => {
    if (role !== "manager") {
      return item.title !== "Keuangan" && item.title !== "Karyawan";
    }
    return true;
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="">
        <DashboardTabs
          data={dashboardMenu}
          className="w-full"
        >
          <InputDate
            mode="range"
            value={dateRange}
            onChange={(date) => setDateRange(date as DateRange)}
            className="border-input/30 bg-card ms-auto w-56 max-lg:w-full lg:h-8"
            align="end"
          />
        </DashboardTabs>
      </div>
    </AppLayout>
  );
}
