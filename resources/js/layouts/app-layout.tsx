import { Toaster } from "@/components/ui/sonner";
import AppLayoutTemplate from "@/layouts/app/app-sidebar-layout";
import { FlashMessages, type BreadcrumbItem } from "@/types";
import { usePage } from "@inertiajs/react";
import { useEffect, type ReactNode } from "react";
import { toast } from "sonner";

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export default ({ children, breadcrumbs, className, ...props }: AppLayoutProps) => {
  const { flash } = usePage<{ flash?: FlashMessages }>().props;

  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.warning) toast.warning(flash.warning);
    if (flash?.error) {
      toast.error("Terjadi Kesalahan", {
        description: flash.error,
      });
    }
  }, [flash?.success, flash?.error, flash?.warning]);

  return (
    <>
      <AppLayoutTemplate
        breadcrumbs={breadcrumbs}
        className={className}
        {...props}
      >
        {children}
      </AppLayoutTemplate>
      <Toaster />
    </>
  );
};
