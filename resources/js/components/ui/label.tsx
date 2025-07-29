import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Label({
  className,
  required = false,
  optional = false,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & {
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-sm text-muted-foreground leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        required && "after:content-['*'] after:text-red-700 after:ms-0.5",
        className
      )}
      {...props}
    />
  )
}

export { Label }
