import { ChartCountBedType } from "@/components/charts/count-bed-type";
import { ChartCountRoomType } from "@/components/charts/count-room-type";
import { ChartCountUserRole } from "@/components/charts/count-user-role";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";

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
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <ChartCountUserRole data={userRoleCount} />
        <ChartCountRoomType data={roomTypeCount} />
        <ChartCountBedType data={bedTypeCount} />
      </div>
    </AppLayout>
  );
}
