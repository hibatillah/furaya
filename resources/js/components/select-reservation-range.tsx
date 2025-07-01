import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dateConfig } from "@/static";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar1Icon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export type ReservationRangeType = "upcoming" | "last_30_days" | "last_3_months" | "last_6_months" | "last_year" | "custom_range";

export function SelectReservationRange({ type: initialType, routeName }: { type: ReservationRangeType; routeName: string }) {
  const [openSelect, setOpenSelect] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [type, setType] = useState<ReservationRangeType>(initialType);
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  /**
   * Set initial type, get initial type from server.
   */
  useEffect(() => setType(initialType), [initialType]);

  /**
   * Handle date show based on the selected date range.
   */
  const handleDateShow = useCallback(() => {
    if (date?.from && date.to) {
      return `${format(date.from, "PP", dateConfig)} - ${format(date.to, "PP", dateConfig)}`;
    } else if (date?.from) {
      return format(date.from, "PP", dateConfig);
    } else {
      return "Pilih Rentang";
    }
  }, [date]);

  /**
   * Handle data show based on the selected type and date range.
   * Date range handle only for `custom_range`.
   *
   * @param type - The type of the reservation range.
   */
  const handleDataByDate = useCallback(
    (type: ReservationRangeType) => {
      router.get(
        route(routeName),
        {
          ...(type === "custom_range" && date?.from && date?.to
            ? {
                start: format(date.from, "yyyy-MM-dd", dateConfig),
                end: format(date.to, "yyyy-MM-dd", dateConfig),
              }
            : {}),
          type,
        },
        { preserveState: true },
      );
    },
    [date, type],
  );

  return (
    <div className="flex items-center">
      <Select
        value={type}
        onValueChange={(value) => {
          setType(value as ReservationRangeType);
          setDate(undefined);
          handleDataByDate(value as ReservationRangeType);
        }}
        open={openSelect}
        onOpenChange={(value) => {
          setOpenCalendar(false);
          setOpenSelect(value);
        }}
      >
        <SelectTrigger className="w-56 rounded-e-none bg-inherit">
          <SelectValue
            placeholder="Pilih Rentang"
            className="truncate whitespace-nowrap"
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="upcoming">Mendatang</SelectItem>
          <SelectItem value="last_30_days">30 Hari Terakhir</SelectItem>
          <SelectItem value="last_3_months">3 Bulan Terakhir</SelectItem>
          <SelectItem value="last_6_months">6 Bulan Terakhir</SelectItem>
          <SelectItem value="last_year">1 Tahun Terakhir</SelectItem>
          <SelectItem
            value="custom_range"
            className="hidden"
          >
            {handleDateShow()}
          </SelectItem>
        </SelectContent>
      </Select>
      <Popover
        open={openCalendar}
        onOpenChange={setOpenCalendar}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="-ms-px rounded-s-none"
          >
            <Calendar1Icon className="size-4" />
            <span className="sr-only">Pilih Rentang Tanggal</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-auto overflow-hidden p-0"
        >
          <Calendar
            mode="range"
            selected={date as DateRange}
            onSelect={(date) => {
              if (date) {
                setDate(date);
                setType("custom_range");
                handleDataByDate("custom_range");
              }
            }}
            locale={id}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
