import { cn } from "@/lib/utils";
import { dateConfig } from "@/static";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { DateRange, Matcher } from "react-day-picker";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export type InputDate = Date | DateRange | undefined;

interface InputDateProps {
  mode: "single" | "range";
  value: InputDate;
  onChange: (date: InputDate) => void;
  popoverState?: [boolean, Dispatch<SetStateAction<boolean>>];
  className?: string;
  disabled?: boolean;
  disabledDate?: Matcher | Matcher[] | undefined;
  defaultMonth?: Date;
  align?: "start" | "center" | "end";
}

export function InputDate(props: InputDateProps) {
  const { mode, value: date, onChange, popoverState, className, disabled, disabledDate, defaultMonth, align = "start" } = props;

  const _popoverState = useState<boolean>(false);
  const [open, setOpen] = popoverState ?? _popoverState;

  let showDate: string;
  if (date instanceof Date) {
    // set for single date
    showDate = format(date, "PP", dateConfig);
  } else if (date?.from && date?.to) {
    // set for range date
    const from = format(date.from, "PP", dateConfig);
    const to = date.to ? format(date.to, "PP", dateConfig) : null;
    showDate = to ? `${from} - ${to}` : from;
  } else {
    // Placeholder
    showDate = "Pilih tanggal";
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant="outline"
          className={cn("w-32 justify-between font-normal", className)}
          disabled={disabled}
        >
          {showDate}
          <CalendarIcon className="text-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className="w-auto overflow-hidden p-0"
      >
        {mode === "single" && (
          <Calendar
            mode="single"
            selected={date as Date}
            onSelect={onChange}
            disabled={disabledDate}
            locale={id}
            defaultMonth={defaultMonth}
            captionLayout="dropdown"
          />
        )}
        {mode === "range" && (
          <Calendar
            mode="range"
            selected={date as DateRange}
            onSelect={onChange}
            disabled={disabledDate}
            locale={id}
            defaultMonth={defaultMonth}
            captionLayout="dropdown"
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
