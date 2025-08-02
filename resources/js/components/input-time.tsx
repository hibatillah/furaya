"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function InputTime({
  className,
  initialValue,
  ...props
}: React.ComponentProps<"input"> & {
  initialValue?: {
    hours: number;
    minutes: number;
  };
}) {
  return (
    <Input
      id="time"
      type="time"
      step="5"
      className={cn(
        "bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none",
        className,
      )}
      {...props}
    />
  );
}
