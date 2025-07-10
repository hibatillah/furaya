import { ChartCountBedType } from "@/components/charts/count-bed-type-chart";
import { ChartCountFacilityUsed } from "@/components/charts/count-facility-used-chart";
import { ChartCountGuestNationality } from "@/components/charts/count-guest-nationality-chart";
import { ChartCountGuestReservation } from "@/components/charts/count-guest-reservation-chart";
import { ChartCountRoomType } from "@/components/charts/count-room-type-chart";
import { ChartCountSmokingType } from "@/components/charts/count-smoking-type-chart";
import { ChartCountSmokingTypeReservation } from "@/components/charts/count-smoking-type-reservation-chart";
import { ChartCountUserRole } from "@/components/charts/count-user-role-chart";
import { ChartDailyReservationVolume } from "@/components/charts/daily-reservation-volume-chart";
import { ChartMonthlyReservationVolume } from "@/components/charts/monthly-reservation-volume-chart";
import { ChartMostRoomTypeReservation } from "@/components/charts/most-room-type-reservation-chart";
import ReservationCard from "@/components/charts/reservation-card";
import { ChartReservationStatusDistribution } from "@/components/charts/reservation-status-distribution-chart";
import DashboardTabs, { DashboardTabsData } from "@/components/dashboard-tabs";
import AppLayout from "@/layouts/app-layout";
import { SharedData, type BreadcrumbItem } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { CalendarCheckIcon, CircleDollarSignIcon, EarthIcon, HotelIcon, UsersIcon } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Dashboard",
    href: route("dashboard"),
  },
];

export default function Dashboard({ charts }: { charts: Record<string, Record<string, number>> }) {
  const { auth } = usePage<SharedData>().props;
  const role = auth.user?.role as Enum.Role;

  let dashboardMenu: DashboardTabsData[] = [
    {
      title: "Reservasi",
      icon: CalendarCheckIcon,
      content: (
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-6">
          <ReservationCard
            daily={charts.daily_reservation_volume}
            monthly={charts.monthly_reservation_volume}
            roomType={charts.room_type_popularity}
            guest={charts.top_guests_by_reservation_count}
          />
          <ChartDailyReservationVolume
            data={charts.daily_reservation_volume}
            className="lg:col-span-full"
          />
          <ChartMonthlyReservationVolume
            data={charts.monthly_reservation_volume}
            className="lg:col-span-3"
          />
          <ChartCountGuestReservation
            data={charts.top_guests_by_reservation_count}
            className="lg:col-span-3"
          />
          <ChartMostRoomTypeReservation
            data={charts.room_type_popularity}
            className="lg:col-span-2"
          />
          <ChartReservationStatusDistribution
            data={charts.reservation_status_distribution}
            className="lg:col-span-2"
          />
          <ChartCountSmokingTypeReservation
            data={charts.smoking_type_reservation}
            className="lg:col-span-2"
          />
        </div>
      ),
    },
    {
      title: "Kamar",
      icon: HotelIcon,
      content: (
        <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-3 2xl:grid-cols-3">
          <ChartCountRoomType data={charts.room_type_count} />
          <ChartCountBedType data={charts.bed_type_count} />
          <ChartCountSmokingType data={charts.room_smoking_type_distribution} />
          <ChartCountFacilityUsed
            data={charts.most_used_facility_by_room}
            className="xl:col-span-2"
          />
        </div>
      ),
    },
    {
      title: "Demografi",
      icon: EarthIcon,
      content: (
        <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-6">
          <ChartCountGuestNationality
            data={charts.guest_nationality_distribution}
            className="xl:col-span-3"
          />
          <ChartCountUserRole
            data={charts.user_role_count}
            className="xl:col-span-2"
          />
        </div>
      ),
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
    // if (role !== "manager") {
    // }
    return item.title !== "Keuangan" && item.title !== "Karyawan";
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div>
        <DashboardTabs
          data={dashboardMenu}
          className="w-full"
        />
      </div>
    </AppLayout>
  );
}
