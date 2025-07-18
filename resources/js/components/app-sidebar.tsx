import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { SharedData, type NavItem } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import {
  ArchiveIcon,
  BedSingleIcon,
  BriefcaseIcon,
  CalendarCheckIcon,
  CircleDollarSignIcon,
  ClockFadingIcon,
  FlagIcon,
  HotelIcon,
  LayoutGrid,
  MapIcon,
  ShieldUserIcon,
  SquareUserIcon,
  TagIcon,
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
      title: "Tamu",
      href: route("guest.index"),
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
    // {
    //   title: "Admin",
    //   href: route("admin.index"),
    //   icon: ShieldUserIcon,
    // },
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
  Kamar: [
    {
      title: "Kamar",
      href: route("room.index"),
      icon: HotelIcon,
    },
    {
      title: "Tipe Kamar",
      href: route("roomtype.index"),
      icon: TagIcon,
    },
    {
      title: "Tipe Tarif",
      href: route("rate.type.index"),
      icon: CircleDollarSignIcon,
    },
    {
      title: "Tipe Kasur",
      href: route("bedtype.index"),
      icon: BedSingleIcon,
    },
    {
      title: "Fasilitas",
      href: route("facility.index"),
      icon: ArchiveIcon,
    },
  ],
  Tamu: [
    {
      title: "Tamu",
      href: route("guest.index"),
      icon: UsersIcon,
    },
    {
      title: "Tipe Tamu",
      href: route("guest.type.index"),
      icon: SquareUserIcon,
    },
    {
      title: "Geografi",
      href: route("geography.index"),
      icon: MapIcon,
    },
    {
      title: "Negara",
      href: route("country.index"),
      icon: FlagIcon,
    },
    {
      title: "Kewarganegaraan",
      href: route("nationality.index"),
      icon: FlagIcon,
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
      title: "Check In - Out",
      href: route("checkin.index"),
      icon: ClockFadingIcon,
    },
  ],
  Kamar: [
    {
      title: "Status Kamar",
      href: route("room.index"),
      icon: HotelIcon,
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
      variant="sidebar"
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
        {auth.role !== "guest" &&
          Object.entries(menuItems[auth.role as keyof typeof menuItems]).map(([key, value]) => (
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
