import { LucideIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export interface DashboardTabsData {
  title: string;
  icon?: LucideIcon;
  content: React.ReactNode;
}

export default function DashboardTabs(props: { data: DashboardTabsData[]; className?: string; children?: React.ReactNode }) {
  const { className, data, children } = props;

  return (
    <Tabs defaultValue="tab-1" className="space-y-2">
      <div className="w-full max-lg:space-y-2 lg:flex lg:items-center lg:justify-between lg:border-b">
        <ScrollArea>
          <TabsList className={cn("text-foreground max-lg:border-b max-lg:mb-2 h-auto justify-start gap-1 rounded-none bg-transparent px-0 py-1", className)}>
            {data.map((item, index) => (
              <TabsTrigger
                value={`tab-${index + 1}`}
                className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative px-2.5 after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {item.icon && (
                  <item.icon
                    className="-ms-0.5 me-1.5 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                )}
                {item.title}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar
            orientation="horizontal"
            className="h-2"
          />
        </ScrollArea>
        <div className="flex w-full gap-4">{children}</div>
      </div>
      {data.map((item, index) => (
        <TabsContent value={`tab-${index + 1}`}>{item.content}</TabsContent>
      ))}
    </Tabs>
  );
}
