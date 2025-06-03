import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { SharedData, type NavItem } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import {
  BadgeCheckIcon,
  BedDoubleIcon,
  BedSingleIcon,
  BriefcaseIcon,
  CalendarCheckIcon,
  ClockArrowDownIcon,
  ClockArrowUpIcon,
  LayoutGrid,
  Package2Icon,
  ShieldUserIcon,
  UsersIcon,
} from "lucide-react";
import AppLogo from "./app-logo";

const managerMenuItems: Record<string, NavItem[]> = {
  Default: [
    {
      title: "Dashboard",
      href: route("dashboard"),
      icon: LayoutGrid,
    },
  ],
  Layanan: [
    {
      title: "Reservasi",
      href: route("reservation.index"),
      icon: CalendarCheckIcon,
    },
    {
      title: "Customer",
      href: route("customer.index"),
      icon: UsersIcon,
    },
  ],
  Manajemen: [
    {
      title: "Pengguna",
      href: route("user.index"),
      icon: UsersIcon,
    },
    {
      title: "Karyawan",
      href: route("employee.index"),
      icon: UsersIcon,
    },
    {
      title: "Admin",
      href: route("admin.index"),
      icon: ShieldUserIcon,
    },
    {
      title: "Departemen",
      href: route("department.index"),
      icon: BriefcaseIcon,
    },
  ],
};

const adminMenuItems: Record<string, NavItem[]> = {
  Default: [
    {
      title: "Dashboard",
      href: route("dashboard"),
      icon: LayoutGrid,
    },
  ],
  Layanan: [
    {
      title: "Kamar",
      href: route("room.index"),
      icon: BedSingleIcon,
    },
    {
      title: "Tipe Kamar",
      href: route("roomtype.index"),
      icon: BedDoubleIcon,
    },
    {
      title: "Tipe Kasur",
      href: route("bedtype.index"),
      icon: BedDoubleIcon,
    },
    {
      title: "Fasilitas",
      href: route("facility.index"),
      icon: Package2Icon,
    },
  ],
};

const employeeMenuItems: Record<string, NavItem[]> = {
  Default: [
    {
      title: "Dashboard",
      href: route("dashboard"),
      icon: LayoutGrid,
    },
  ],
  Reservasi: [
    {
      title: "Reservasi",
      href: route("reservation.index"),
      icon: CalendarCheckIcon,
    },
    {
      title: "Check In",
      href: route("checkin.index"),
      icon: ClockArrowUpIcon,
    },
    {
      title: "Check Out",
      href: route("checkout.index"),
      icon: ClockArrowDownIcon,
    },
  ],
  Kamar: [
    {
      title: "Status Kamar",
      href: route("room.status.index"),
      icon: BadgeCheckIcon,
    },
  ],
};

export function AppSidebar() {
  const { auth } = usePage<SharedData>().props;

  const menuItems = {
    manager: managerMenuItems,
    admin: adminMenuItems,
    employee: employeeMenuItems,
  };

  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
            >
              <Link
                href={route("dashboard")}
                prefetch
              >
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="py-10">
        {Object.entries(menuItems[auth.role as keyof typeof menuItems]).map(([key, value]) => (
          <NavMain
            key={key}
            title={key}
            items={value}
          />
        ))}
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
