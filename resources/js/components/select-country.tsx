import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn, getCountryImgUrl } from "@/lib/utils";

interface SelectCountryProps {
  label?: string;
  data: {
    code: string;
    name: string;
  }[];
  value: string | undefined;
  setValue: (value: { code: string; name: string }) => void;
  action?: React.ReactNode;
  className?: string;
}

export default function SelectCountry({ data, value, setValue, action, className, label }: SelectCountryProps) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);

  function handleSelect(value: string) {
    const country = data.find((item) => item.name === value);

    if (!country) return "Data tidak ditemukan";

    return (
      <div className="flex items-center gap-2">
        <img
          src={getCountryImgUrl(country.code)}
          alt={country.name}
          className="h-auto w-5 border object-contain"
        />
        <span>{country.name}</span>
      </div>
    );
  }

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
          className={cn(
            "bg-accent border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]",
            className,
          )}
        >
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {value ? handleSelect(value) : label ? `Pilih ${label}` : "Pilih data"}
          </span>
          <ChevronDownIcon
            size={16}
            className="text-muted-foreground/80 shrink-0"
            aria-hidden="true"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="border-input w-92 min-w-[var(--radix-popper-anchor-width)] p-0"
        align="start"
      >
        <Command className="rounded-lg">
          <CommandInput placeholder="Cari negara" />
          <CommandList className="relative">
            <CommandEmpty>{label ?? "Data"} tidak tersedia</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.code}
                  value={item.name}
                  onSelect={() => {
                    setValue({ code: item.code, name: item.name });
                    setOpen(false);
                  }}
                >
                  <img
                    src={getCountryImgUrl(item.code)}
                    alt={item.name}
                    className="h-4 w-4 object-contain"
                  />
                  <span>{item.name}</span>
                  {value === item.name && (
                    <CheckIcon
                      size={16}
                      className="ml-auto"
                    />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            {action && (
              <>
                <CommandSeparator />
                <CommandGroup>{action}</CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
