import React from "react";

import { Column } from "@tanstack/react-table";

import { FilterComponent } from "@/components/data-table/data-table";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

import { useFilter } from "./context";

import { ChevronLeftIcon, FilterIcon } from "lucide-react";

function Filter<T>({
  column,
  data,
}: {
  column: Column<T>;
  data: SelectData[] | string[];
}) {
  return (
    <RadioGroup
      value={column.getFilterValue() as string}
      onValueChange={(value: string) => column.setFilterValue(value)}
      data-large={data.length >= 10}
      className="grid gap-2.5 data-[large=true]:grid-cols-2"
    >
      {data.map((item, key) => (
        <Label
          key={key}
          htmlFor={key.toString()}
          className="flex select-none gap-2 capitalize"
        >
          <RadioGroupItem
            value={typeof item === "string" ? item : item.value ?? ""}
            id={key.toString()}
          />
          <span>{typeof item === "string" ? item : item.label}</span>
        </Label>
      ))}
    </RadioGroup>
  );
}

export function RadioFilter<T>(props: FilterComponent<T>) {
  const { column, data, label, standalone, className, ...rest } = props;
  const { setState, clearFilter, isFilterActive } = useFilter<T>();

  const [open, setOpen] = React.useState(false);

  // check is filter active
  const isFiltering = isFilterActive(column);

  // get unique values from exist data
  const facetedUniqueValues = column.getFacetedUniqueValues();
  const uniqueValues = React.useMemo(() => {
    if (!facetedUniqueValues) return [];
    const values = Array.from(facetedUniqueValues.keys());
    return values.sort();
  }, [facetedUniqueValues]);

  // use custom data if exist
  const mapData = data ?? uniqueValues;

  if (standalone) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("capitalize", className)}
            {...rest}
          >
            <div
              data-active={isFiltering}
              className="after:bg-teal-700 dark:after:bg-teal-600 relative after:absolute after:-end-px after:top-px after:size-1.5 after:rounded-full data-[active=false]:after:hidden"
            >
              <FilterIcon className="text-muted-foreground" />
            </div>
            <span>{label ?? column.id}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="group !w-fit !min-w-40 !gap-2 p-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-foreground/90 text-xs">Filter</span>
            <button
              onClick={() => {
                clearFilter(column);
                setOpen(false);
              }}
              disabled={!isFiltering}
              className="text-muted-foreground not-disabled:hover:text-foreground not-disabled:cursor-pointer not-disabled:hover:underline text-xs underline-offset-2"
            >
              Reset
            </button>
          </div>
          <Separator className="mt-1 mb-2" />
          <Filter column={column} data={mapData} />
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
          <span className="text-xs capitalize">{label ?? column.id}</span>
        </Button>
        <Button
          variant="link"
          size="sm"
          onClick={() => clearFilter(column)}
          disabled={column.getFilterValue() === undefined}
          className="text-muted-foreground not-disabled:hover:text-foreground not-disabled:hover:underline not-disabled:cursor-pointer h-5 rounded-sm px-1 py-0 text-xs underline-offset-2"
        >
          Reset
        </Button>
      </div>
      <Separator className="mb-1" />
      <Filter column={column} data={mapData} />
    </>
  );
}
