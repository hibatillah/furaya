import React from "react";

import { addHours, addMinutes, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { FilterComponent } from "@/types/data-table";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import { useFilter } from "./context";

import { CalendarRangeIcon, ChevronLeftIcon } from "lucide-react";

export function DateRangeFilter<T>(props: FilterComponent<T>) {
  const { column, label, standalone } = props;
  const { setState, clearFilter, isFilterActive } = useFilter<T>();

  const [date, setDate] = React.useState<DateRange | undefined>();

  // check is filter active
  const isFiltering = isFilterActive(column);

  const filterValue = column.getFilterValue() as string[];

  // get date range from filter value
  const from = filterValue?.[0] ? new Date(filterValue[0]) : undefined;
  const to = filterValue?.[1] ? new Date(filterValue[1]) : undefined;

  // get date range object
  const formatDate = {
    from: isNaN(from?.getTime() || NaN) ? undefined : from,
    to: isNaN(to?.getTime() || NaN) ? undefined : to,
  };

  function handleDateChange(selectedDate: DateRange | undefined) {
    column.setFilterValue(
      selectedDate?.from && selectedDate?.to
        ? [selectedDate.from, addMinutes(addHours(selectedDate.to, 23), 59)]
        : undefined,
    );
  }

  if (standalone) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="capitalize">
            <div
              data-active={isFiltering}
              className="after:bg-primary relative after:absolute after:-end-px after:top-px after:size-1.5 after:rounded-full data-[active=false]:after:hidden dark:after:bg-teal-600"
            >
              <CalendarRangeIcon className="text-muted-foreground" />
            </div>
            <span className="truncate">
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                (label ?? "Tanggal")
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-3">
          <div className="flex items-center justify-between">
            <span className="text-foreground/90 text-xs">Filter</span>
            <button
              onClick={() => {
                clearFilter(column);
                setDate(undefined);
              }}
              disabled={!isFiltering}
              className="text-muted-foreground not-disabled:hover:text-foreground not-disabled:cursor-pointer not-disabled:hover:underline text-xs underline-offset-2"
            >
              Reset
            </button>
          </div>
          <Separator className="my-1" />
          <Calendar
            mode="range"
            selected={date}
            onSelect={(e) => {
              setDate(e);
              handleDateChange(e);
            }}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="h-fit gap-1 rounded-sm py-0.5 !pe-2 !ps-0.5"
          onClick={() => setState("idle")}
        >
          <ChevronLeftIcon className="size-3" />
          <span className="text-xs capitalize">Tanggal</span>
        </Button>

        <Button
          variant="link"
          size="sm"
          onClick={() => clearFilter(column)}
          disabled={!from && !to}
          className="text-muted-foreground not-disabled:hover:text-foreground not-disabled:hover:underline not-disabled:cursor-pointer h-5 rounded-sm px-1 py-0 text-xs underline-offset-2"
        >
          Reset
        </Button>
      </div>
      <Separator />
      <Calendar
        mode="range"
        selected={date}
        onSelect={(e) => handleDateChange(e)}
        defaultMonth={formatDate.from ?? formatDate.to ?? new Date()}
      />
    </>
  );
}
