import { Breadcrumbs } from "@/components/breadcrumbs";
import ThemeToggle from "@/components/theme-toggle";
import { type BreadcrumbItem as BreadcrumbItemType } from "@/types";
import { SidebarTrigger } from "./ui/sidebar";

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
  return (
    <header className="border-sidebar-border/50 flex h-14 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
      <ThemeToggle />
    </header>
  );
}
