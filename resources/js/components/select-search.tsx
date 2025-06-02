import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface SelectSearchProps {
  label?: string;
  data: {
    value: string;
    label: string;
  }[];
  value: string;
  setValue: (value: string) => void;
  action?: React.ReactNode;
  className?: string;
}

export default function SelectSearch({ data, value, setValue, action, className, label }: SelectSearchProps) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("bg-inherit hover:bg-background/20 border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]", className)}
        >
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {value ? data.find((item) => item.value === value)?.label : label ? `Pilih ${label}` : "Pilih data"}
          </span>
          <ChevronDownIcon
            size={16}
            className="text-muted-foreground/80 shrink-0"
            aria-hidden="true"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder={label ? `Cari ${label}` : "Cari data"} />
          <CommandList>
            <CommandEmpty>{label ?? "Data"} tidak tersedia</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {item.label}
                  {value === item.value && (
                    <CheckIcon
                      size={16}
                      className="ml-auto"
                    />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            {action && <CommandGroup>{action}</CommandGroup>}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
