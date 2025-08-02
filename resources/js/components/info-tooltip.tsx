import { cn } from "@/lib/utils";
import { InfoIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function InfoTooltip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground size-4 rounded-full !p-0"
        >
          <InfoIcon className="size-3 translate-x-[0.5px] -translate-y-[0.5px]" />
          <span className="sr-only">Info</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent className={cn("w-60 text-center text-pretty", className)}>{children}</TooltipContent>
    </Tooltip>
  );
}
