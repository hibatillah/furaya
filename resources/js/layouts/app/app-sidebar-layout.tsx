import { AppContent } from "@/components/app-content";
import { AppShell } from "@/components/app-shell";
import { AppSidebar } from "@/components/app-sidebar";
import { AppSidebarHeader } from "@/components/app-sidebar-header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { type BreadcrumbItem } from "@/types";
import { type PropsWithChildren } from "react";

export default function AppSidebarLayout({
  children,
  breadcrumbs = [],
  className,
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[]; className?: string }>) {
  return (
    <AppShell variant="sidebar">
      <AppSidebar />
      <AppContent variant="sidebar" className="flex flex-col min-h-screen">
        <AppSidebarHeader breadcrumbs={breadcrumbs} />
        <div className={cn("flex flex-col flex-auto gap-4 p-6", className)}>
          <TooltipProvider>{children}</TooltipProvider>
        </div>
      </AppContent>
    </AppShell>
  );
}
