import { CircleHelpIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils";

export function HelpTooltip({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("text-muted-foreground size-6 rounded-full", className)}
        >
          <CircleHelpIcon className="size-4 stroke-[1.5]" />
          <span className="sr-only">Informasi</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="w-72 text-center">{children}</TooltipContent>
    </Tooltip>
  );
}
