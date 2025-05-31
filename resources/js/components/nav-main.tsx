import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { NavCollapsibleItem, type NavItem } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

export function NavCollapsible({ items }: { items: NavCollapsibleItem[] }) {
  const page = usePage();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          return item.items && item.items.length > 0 ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton isActive={page.url.startsWith(subItem.href)}>
                          <Link
                            href={subItem.href}
                            prefetch
                          >
                            {/* {subItem.icon && <subItem.icon />} */}
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={page.url.startsWith(item.href)}
                tooltip={{ children: item.title }}
              >
                <Link
                  href={item.href}
                  prefetch
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function NavMain({ title, items = [] }: { title?: string; items: NavItem[] }) {
  const page = usePage();
  const appUrl = page.props.url as string;

  return (
    <SidebarGroup className="px-2 py-0">
      {title && title !== "Default" && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          const itemUrl = item.href.split(appUrl)[1];
          const isActive = page.url.startsWith(itemUrl);

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={{ children: item.title }}
              >
                <Link
                  href={item.href}
                  prefetch
                >
                  {item.icon && (
                    <item.icon
                      className="text-primary size-10"
                      size={30}
                    />
                  )}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
