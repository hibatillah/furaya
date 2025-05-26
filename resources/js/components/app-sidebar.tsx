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
  LayoutGrid,
  ShieldIcon,
  ShieldUserIcon,
  UsersIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import AppLogo from "./app-logo";

const managerMenuItems: NavItem[] = [
  {
    title: "Dashboard",
    href: route("dashboard"),
    icon: LayoutGrid,
  },
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
    title: "Role",
    href: route("role.index"),
    icon: ShieldIcon,
  },
  {
    title: "Departemen",
    href: route("department.index"),
    icon: BriefcaseIcon,
  },
];

const adminMenuItems: NavItem[] = [
  {
    title: "Dashboard",
    href: route("dashboard"),
    icon: LayoutGrid,
  },
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
    title: "Pengguna",
    href: route("user.index"),
    icon: UsersIcon,
  },
];

const employeeMenuItems: NavItem[] = [
  {
    title: "Dashboard",
    href: route("dashboard"),
    icon: LayoutGrid,
  },
  {
    title: "Status Kamar",
    href: route("roomstatus.index"),
    icon: BadgeCheckIcon,
  },
  {
    title: "Reservasi",
    href: route("reservation.index"),
    icon: CalendarCheckIcon,
  },
];

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
        <NavMain items={menuItems[auth.role as keyof typeof menuItems]} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
