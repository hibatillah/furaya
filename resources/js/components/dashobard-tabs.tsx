import { LucideIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export interface DashboardTabsData {
  title: string;
  icon: LucideIcon;
  content: React.ReactNode;
}

export default function DashboardTabs(props: { data: DashboardTabsData[]; className?: string; children?: React.ReactNode }) {
  const { className, data, children } = props;

  return (
    <Tabs defaultValue="tab-1">
      <TabsList className={cn("text-foreground mb-3 h-auto justify-start gap-2 rounded-none border-b bg-transparent px-0 py-1", className)}>
        {data.map((item, index) => (
          <TabsTrigger
            value={`tab-${index + 1}`}
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <item.icon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            {item.title}
          </TabsTrigger>
        ))}
        {children}
      </TabsList>
      {data.map((item, index) => (
        <TabsContent value={`tab-${index + 1}`}>{item.content}</TabsContent>
      ))}
    </Tabs>
  );
}
