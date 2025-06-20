import * as React from "react";

import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useRef } from "react";

function Input({ className, type, ref, disabled, disableHandle = false, ...props }: React.ComponentProps<"input"> & {
  disableHandle?: boolean;
}) {
  const baseRef = useRef<HTMLInputElement>(null);
  const inputRef = (ref as React.RefObject<HTMLInputElement>) ?? baseRef;

  const increase = () => {
    if (inputRef?.current) {
      inputRef.current.stepUp();
    }
  };

  const decrease = () => {
    if (inputRef?.current) {
      inputRef.current.stepDown();
    }
  };

  return (
    <div className="relative">
      <input
        type={type}
        ref={inputRef}
        data-slot="input"
        disabled={disabled}
        className={cn(
          "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
      {type === "number" && !disableHandle && !disabled && (
        <div className="absolute end-0 inset-y-0 pe-px pt-px pb-[0.5px] grid grid-rows-2 border-s border-input divide-y divide-input">
          <button
            type="button"
            onClick={increase}
            className="hover:bg-muted text-muted-foreground hover:text-foreground w-full px-2 rounded-tr-md"
          >
            <ChevronUpIcon size={12} aria-hidden="true" />
            <span className="sr-only">Tambah</span>
          </button>
          <button
            type="button"
            onClick={decrease}
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

