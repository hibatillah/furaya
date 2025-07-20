import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { SharedData, type NavItem } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { type PropsWithChildren } from "react";

export default function SettingsLayout({ children }: PropsWithChildren) {
  // When server-side rendering, we only render the layout on the client...
  if (typeof window === "undefined") {
    return null;
  }

  const { auth } = usePage<SharedData>().props;
  const isGuest = auth.role === "guest";

  const sidebarNavItems: NavItem[] = [
    {
      title: "Profile",
      href: isGuest ? route("public.profile.edit") : route("profile.edit"),
      icon: null,
    },
    {
      title: "Password",
      href: isGuest ? route("public.password.edit") : route("password.edit"),
      icon: null,
    },
  ];

  const currentPath = window.location.pathname;

  return (
    <div className="px-4 py-6">
      <Heading
        title="Settings"
        description="Manage your profile and account settings"
      />

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
        <aside className="w-full max-w-xl lg:w-48">
          <nav className="flex flex-col space-y-1 space-x-0">
            {sidebarNavItems.map((item, index) => (
              <Button
                key={`${item.href}-${index}`}
                size="sm"
                variant="ghost"
                asChild
                className={cn("w-full justify-start", {
                  "bg-white dark:bg-muted not-dark:hover:bg-white": item.href.includes(currentPath),
                })}
              >
                <Link
                  href={item.href}
                  prefetch
                >
                  {item.title}
                </Link>
              </Button>
            ))}
          </nav>
        </aside>

        <Separator className="my-6 md:hidden" />

        <div className="flex-1 md:max-w-2xl">
          <section className="max-w-xl space-y-12">{children}</section>
        </div>
      </div>
    </div>
  );
}
