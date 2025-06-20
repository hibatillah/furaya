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
          className="size-5 rounded-full"
        >
          <InfoIcon className="size-3" />
          <span className="sr-only">Info</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent className={cn("w-60 text-center", className)}>{children}</TooltipContent>
    </Tooltip>
  );
}
