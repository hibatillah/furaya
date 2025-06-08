/**
 * @file Define filters function components for data table.
 *
 * @description
 * - filter fn return filter component for grouped filter by default.
 * - use `standalone` prop to show filter component as standalone filter.
 *
 * @author hibatillah
 */
import React from "react";

import { Column } from "@tanstack/react-table";

import type { DataTableFilter, FilterComponent, FilterMap, FilterMapItem, FilterVariant, GroupedFilter, StandaloneFilter } from "@/components/data-table/data-table";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import { CheckboxFilter } from "./filter/checkbox-filter";
import { FilterProvider, useFilter } from "./filter/context";
import { DateRangeFilter } from "./filter/date-range-filter";
import { DateYearFilter } from "./filter/date-year-filter";
import { RadioFilter } from "./filter/radio-filter";

import { CalendarIcon, CalendarRangeIcon, CircleCheckIcon, ListFilterIcon, SquareCheckIcon } from "lucide-react";

/**
 * Define each filter component based on extended filter functions.
 * @returns components, icon
 */
function filterComponentsMap<T>(variant?: FilterVariant) {
  const filterComponentsMap: FilterMap<T> = {
    checkbox: { component: CheckboxFilter, icon: SquareCheckIcon },
    radio: { component: RadioFilter, icon: CircleCheckIcon },
    "date-range": { component: DateRangeFilter, icon: CalendarRangeIcon },
    "date-year": { component: DateYearFilter, icon: CalendarIcon },
  };

  return variant ? filterComponentsMap[variant] : filterComponentsMap;
}

/**
 * @function Filter list for grouped filter
 * @description Manage filter state to show active filter component on popover
 */
function FilterItem<T>(props: FilterComponent<T>) {
  const { column, data, label } = props;
  const { state, setState, isFilterActive, getFilterName } = useFilter<T>();

  // get current filter value
  const filterValue = column.getFilterValue();
  const isFiltering = isFilterActive(column);

  const selectedValue = React.useMemo(() => {
    return Array.isArray(filterValue) ? filterValue : [];
  }, [filterValue]);

  const filterText: Record<FilterVariant, string> = {
    checkbox: column.id,
    radio: column.id,
    "date-range": "Tanggal",
    "date-year": "Tahun",
  };

  // get and check column filter name match {filters}
  const filterKey = getFilterName(column) as FilterVariant;

  // define filter components and icon
  const filterComponents = filterComponentsMap<T>() as FilterMap<T>;
  const Icon = filterComponents[filterKey].icon;
  const FilterComponent = filterComponents[filterKey].component;

  // active state not match this filter
  if (state && state !== column.id && state !== "idle") return null;

  // return active filter component
  if (state === column.id) {
    return (
      <FilterComponent
        column={column}
        data={data}
        label={label}
      />
    );
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className="h-7 justify-start !ps-1 text-sm"
      onClick={() => setState(column.id as keyof T)}
    >
      <Icon className="text-muted-foreground size-4" />
      <span className="capitalize">{label ?? filterText[filterKey]}</span>

      {isFiltering && (
        <span className="text-muted-foreground ms-auto -me-1 line-clamp-1 inline-flex h-5 max-h-full max-w-18 items-center rounded px-1 text-xs font-[weight:inherit] capitalize">
          {filterKey === "checkbox" ? `${selectedValue.length} dipilih` : "Dipilih"}
        </span>
      )}
    </Button>
  );
}

function GroupedFilter<T>(props: DataTableFilter<T>) {
  const { table, standalone = false, className, ...rest } = props;
  const { state, setState, filters, getFilterName, isFilterActive } = useFilter<T>();

  const [open, setOpen] = React.useState(false);

  // separate props
  const { extend } = props as GroupedFilter<T>;
  const { filter: filterKey, label, data } = props as StandaloneFilter<T>;

  const detachedColumns = extend?.filter((item) => item.detached) ?? [];
  let excludeColumns = ["actions"];

  // exclude columns from detached extend data
  if (extend) {
    excludeColumns = excludeColumns.concat(detachedColumns.map((item) => item.id) as string[]);
  }

  /**
   * Get all columns from table.
   * except includes in `excludeColumns` and filter name includes in `filters`
   */
  const columns = table
    .getAllColumns()
    .filter((column) => !excludeColumns.includes(column.id))
    .filter((column) => {
      const filterKey = getFilterName(column) as FilterVariant;
      return filters.includes(filterKey);
    });

  // get standalone column
  const standaloneColumn = columns.find((column) => column.id === filterKey);

  if (standalone && standaloneColumn) {
    // get and check column filter name match {filters}
    const filterKey = getFilterName(standaloneColumn) as FilterVariant;

    // get filter components
    const filterComponents = filterComponentsMap<T>(filterKey) as FilterMapItem<T>;
    const FilterComponent = filterComponents.component;

    return (
      <FilterComponent
        column={standaloneColumn!}
        data={data}
        label={label}
        className={className}
        standalone
        {...rest}
      />
    );
  }

  // check if some column is filtering
  const isFiltering = columns.some((column) => isFilterActive(column));

  // reset filter columns in used
  function resetColumnsFilter() {
    columns.forEach((column) => column.setFilterValue(undefined));
  }

  // get extend data fn
  function extendItems<T>(column: Column<T>) {
    return extend?.find((item) => item.id === column.id);
  }

  if (columns.length === 0) return null;

  return (
    <Popover
      open={open}
      onOpenChange={(value: boolean) => {
        setOpen(value);
        if (value) setState("idle");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={className}
          {...rest}
        >
          <div
            data-active={isFiltering}
            className="relative after:absolute after:-end-px after:top-px after:size-1.5 after:rounded-full after:bg-teal-700 data-[active=false]:after:hidden dark:after:bg-teal-600"
          >
            <ListFilterIcon className="text-muted-foreground" />
          </div>
          <span className="text-foreground sr-only @2xl:not-sr-only">Filter</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        className="group flex !w-max !min-w-52 flex-col !gap-1 p-2"
      >
        {state === "idle" && (
          <>
            <div className="flex items-center justify-between px-1 pt-0.5">
              <div className="text-foreground/90 text-xs">Pilih Filter</div>
              <button
                onClick={resetColumnsFilter}
                disabled={!isFiltering}
                className="text-muted-foreground not-disabled:hover:text-foreground text-xs underline-offset-2 not-disabled:cursor-pointer not-disabled:hover:underline"
              >
                Reset
              </button>
            </div>
            <Separator className="my-0.5" />
          </>
        )}
        {columns.length > 0 &&
          columns.map((column, i) => {
            const data = extendItems(column)?.data ?? undefined;

            return (
              data &&
              data.length > 0 && (
                <FilterItem
                  key={i}
                  column={column}
                  data={data}
                  label={extendItems(column)?.label ?? undefined}
                />
              )
            );
          })}
      </PopoverContent>
    </Popover>
  );
}

export function DataTableFilter<T>(props: DataTableFilter<T>) {
  return (
    <FilterProvider>
      <GroupedFilter {...props} />
    </FilterProvider>
  );
}
