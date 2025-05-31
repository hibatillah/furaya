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

export default function Dashboard({ userRoleCount }: { userRoleCount: Record<Enum.Role, number> }) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <ChartCountUserRole data={userRoleCount} />
        <ChartCountUserRole data={userRoleCount} />
        <ChartCountUserRole data={userRoleCount} />
      </div>
    </AppLayout>
  );
}
