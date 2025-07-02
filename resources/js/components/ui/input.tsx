import * as React from "react";

import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

function Input({ className, type, disabled, disableHandle = false, onIncrease, onDecrease, ...props }: React.ComponentProps<"input"> & {
  disableHandle?: boolean;
  onIncrease?: () => void;
  onDecrease?: () => void;
}) {
  return (
    <div className="relative">
      <input
        type={type}
        data-slot="input"
        disabled={disabled}
        className={cn(
          "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-accent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
      {type === "number" && (onIncrease && onDecrease) && !disabled && (
        <div className="absolute end-0 inset-y-0 pe-px pt-px pb-[0.5px] grid grid-rows-2 border-s border-input divide-y divide-input">
          <button
            type="button"
            onClick={() => {
              onIncrease();
            }}
            className="hover:bg-muted text-muted-foreground hover:text-foreground w-full px-2 rounded-tr-md"
          >
            <ChevronUpIcon size={12} aria-hidden="true" />
            <span className="sr-only">Tambah</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onDecrease();
            }}
            className="hover:bg-muted text-muted-foreground hover:text-foreground w-full px-2 rounded-br-md"
          >
            <ChevronDownIcon size={12} aria-hidden="true" />
            <span className="sr-only">Kurang</span>
          </button>
        </div>
      )}
    </div>
  )
}

export { Input };

