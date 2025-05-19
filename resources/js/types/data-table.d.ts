/**
 * @file Data Table Type Definition.
 *
 * @template T - Data Table Row Data Type.
 * @template Data - Data Table Row Data Type.
 * @template Value - Data Table Column Value Type.
 *
 * @author hibatillah
 */
import {
  Column,
  ColumnDef,
  FilterFnOption,
  Table,
} from "@tanstack/react-table";

import { customFilterFns } from "../components/data-table/utils";

import { LucideIcon } from "lucide-react";

// Data Table Type Definition
interface Controls {
  pagination?: boolean;
  sorting?: boolean;
}

interface DataTable<Data, Value> {
  columns: ColumnDef<Data, Value>[];
  data: Data[];
  controls?: Controls;
  globalFilter?: FilterFnOption<Data>;
  children?:
    | React.ReactNode
    | ((props: { table: Table<Data> }) => React.ReactNode);
}

// Data Table Controls Type Definition
export interface DataTableControls<T> extends React.ComponentProps<"div"> {
  table: Table<T>;
  search?: boolean;
}

// Data Table Filter Type Definition
export type FilterVariant = keyof typeof customFilterFns;

export type FilterMap<T> = Record<FilterVariant, FilterMapItem<T>>;

export interface FilterComponent<T> extends React.ComponentProps<"button"> {
  column: Column<T>;
  data?: SelectData[] | string[];
  label?: string;
  standalone?: boolean;
}

export interface FilterMapItem<T> {
  icon: LucideIcon;
  component: (
    props: FilterComponent<T> & React.ComponentProps<"button">,
  ) => React.ReactNode;
}

export interface FilterContext<T> {
  state: keyof T | undefined;
  setState: React.Dispatch<React.SetStateAction<keyof T | undefined>>;
  filters: FilterVariant[];
  clearFilter: (column: Column<T>) => void;
  isFilterActive: (column: Column<T>) => boolean;
  getFilterName: (column: Column<T>) => FilterFnOption<T> | undefined;
}

export interface DataFilterExtended<T> {
  id: keyof T;
  label?: string;
  data?: SelectData[] | string[];
  detached?: boolean;
}

export interface GroupedFilter<T> {
  extend?: DataFilterExtended<T>[];
}

export interface StandaloneFilter<T> {
  filter: keyof T;
  label?: string;
  data?: SelectData[] | string[];
}

export interface BaseFilter<T> extends React.ComponentProps<"button"> {
  table: Table<T>;
  standalone?: boolean;
}

export type DataTableFilter<T> = BaseFilter<T> &
  (GroupedFilter<T> | StandaloneFilter<T>);
