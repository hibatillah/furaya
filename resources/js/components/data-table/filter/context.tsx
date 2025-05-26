import React from "react";

import { Column } from "@tanstack/react-table";

import type { FilterContext, FilterState, FilterVariant } from "@/types/data-table";

import { customFilterFns } from "@/components/data-table/utils";

// eslint-disable-next-line
const FilterContext = React.createContext<FilterContext<any> | null>(null);

/**
 * @function hooks for filter context
 *
 * @property
 * - `state` current active filter for grouped filter
 * - `filters` list of filter variant based on `utils.ts`
 * - `clearFilter` reset filter value column
 * - `isFilterActive` check if column is filtering
 * - `getFilterName` get column filter name
 */
export function useFilter<T>() {
  const context = React.useContext(FilterContext);

  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider.");
  }

  return context as FilterContext<T>;
}

/** FilterContext provider */
export function FilterProvider<T>({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<FilterState<T>>();

  // Get all filter variant based on `utils.ts`
  const filters = React.useMemo<FilterVariant[]>(() => {
    return Object.keys(customFilterFns) as FilterVariant[];
  }, []);

  // Check if column is filtering
  const isFilterActive = React.useCallback((column: Column<T>) => {
    return column.getFilterValue() !== undefined;
  }, []);

  // Format column filter name to match custom `filters`
  const getFilterName = React.useCallback((column: Column<T>) => {
    return column?.columnDef.filterFn;
  }, []);

  // Reset filter value column
  const clearFilter = React.useCallback((column: Column<T>) => {
    setState("idle");
    column.setFilterValue(undefined);
  }, []);

  const contextValue = React.useMemo<FilterContext<T>>(
    () => ({
      state,
      setState,
      filters,
      clearFilter,
      isFilterActive,
      getFilterName,
    }),
    [state, setState, filters, clearFilter, isFilterActive, getFilterName],
  );

  return <FilterContext.Provider value={contextValue}>{children}</FilterContext.Provider>;
}
