"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getHours, getMinutes } from "date-fns";

export function InputTime({ className, ...props }: React.ComponentProps<"input">) {
  const now = new Date();
  const hours = getHours(now);
  const minutes = getMinutes(now);

  return (
    <Input
      id="time"
      type="time"
      step="5"
      defaultValue={`${hours}:${minutes}:00`}
      className={cn(
        "bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none",
        className,
      )}
      {...props}
    />
  );
}
