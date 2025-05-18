import { NavCollapsible, NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { NavCollapsibleItem, type NavItem } from "@/types";
import { Link } from "@inertiajs/react";
import {
  BadgeCheckIcon,
  BedDoubleIcon,
  BedSingleIcon,
  BriefcaseIcon,
  CalendarCheckIcon,
  LayoutGrid,
  ShieldIcon,
  ShieldUserIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import AppLogo from "./app-logo";

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    title: "Reservasi",
    href: "/reservasi",
    icon: CalendarCheckIcon,
  },
  {
    title: "Status Kamar",
    href: "/status",
    icon: BadgeCheckIcon,
  },
  {
    title: "Kamar",
    href: "/kamar",
    icon: BedSingleIcon,
  },
  {
    title: "Tipe Kamar",
    href: "/tipe/kamar",
    icon: BedDoubleIcon,
  },
  {
    title: "Tipe Kasur",
    href: "/tipe/kasur",
    icon: BedDoubleIcon,
  },
  {
    title: "Departemen",
    href: "/departemen",
    icon: BriefcaseIcon,
  },
  {
    title: "Karyawan",
    href: "/karyawan",
    icon: UserIcon,
  },
  {
      title: "Manager",
      href: "/manager",
      icon: UserIcon,
    },
    {
        title: "Customer",
        href: "/customer",
        icon: UsersIcon,
    },
    {
        title: "Admin",
        href: "/admin",
        icon: ShieldUserIcon,
    },
    {
      title: "Role",
      href: "/role",
      icon: ShieldIcon,
    },
];

const collapsibleNavItems: NavCollapsibleItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    title: "Reservasi",
    href: "/reservasi",
    icon: CalendarCheckIcon,
  },
  {
    title: "Kamar",
    href: "/kamar",
    icon: BedSingleIcon,
    items: [
      {
        title: "Kamar",
        href: "/kamar",
        icon: BedSingleIcon,
      },
      {
        title: "Status Kamar",
        href: "/status",
        icon: BadgeCheckIcon,
      },
      //
      {
        title: "Tipe Kamar",
        href: "/tipe/kamar",
        icon: BedDoubleIcon,
      },
      {
        title: "Tipe Kasur",
        href: "/tipe/kasur",
        icon: BedDoubleIcon,
      },
    ],
  },
  {
    title: "User",
    href: "/user",
    icon: UserIcon,
  },
  {
    title: "Role",
    href: "/role",
    icon: UserIcon,
  },
  {
    title: "Manager",
    href: "/manager",
    icon: UserIcon,
  },
  {
    title: "Karyawan",
    href: "/karyawan",
    icon: UserIcon,
  },
  {
    title: "Departemen",
    href: "/departemen",
    icon: BriefcaseIcon,
  },
  {
    title: "Customer",
    href: "/customer",
    icon: UsersIcon,
  },
  {
    title: "Admin",
    href: "/admin",
    icon: ShieldUserIcon,
  },
];

export function AppSidebar() {
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
                href="/dashboard"
                prefetch
              >
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="py-10">
        {/* <NavCollapsible items={collapsibleNavItems} /> */}
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
