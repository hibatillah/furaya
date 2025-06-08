"use client";

import * as React from "react";

import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Input } from "../ui/input";
import type { DataTable, DataTableControls } from "./data-table";
import { DataTablePaginations } from "./data-table-pagination";
import { customFilterFns } from "./utils";

import { ChevronDownIcon, ChevronUpIcon, SearchIcon, XIcon } from "lucide-react";

/**
 * Data Table Toolbar Controls.
 *
 * Include search input for global filtering data.
 * Accept children for additional controls.
 */
export function DataTableControls<T>(props: DataTableControls<T>) {
  const { table, search = true, className, children, ...rest } = props;

  const inputRef = React.useRef<HTMLInputElement>(null);

  const isInputEmpty = inputRef.current ? inputRef.current.value.trim() === "" : true;

  // reset global filter
  function resetSearch() {
    table.resetGlobalFilter();

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div
      className={cn("@container flex w-full gap-3", className)}
      {...rest}
    >
      {search && (
        <div className="relative h-full">
          <Input
            ref={inputRef}
            type="search"
            placeholder="Cari data"
            className="bg-card border-border z-10 w-44 ps-8 pe-6 @3xl:w-60"
            onChange={(e) => table.setGlobalFilter(String(e.target.value))}
          />
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-2.5 flex items-center">
            <SearchIcon className="size-4" />
          </div>
          {!isInputEmpty && (
            <button
              type="button"
              onClick={resetSearch}
              className="text-muted-foreground hover:text-foreground absolute inset-y-0 end-0 flex cursor-pointer items-center px-2"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export function DataTable<Data, Value>(props: DataTable<Data, Value> & Omit<React.ComponentProps<"div">, "children">) {
  const { columns, data, children, controls = { pagination: true, sorting: true }, className, fixed = false, pagination, ...rest } = props;

  const defaultPageSize = 10;

  const [globalFilter, setGlobalFilter] = React.useState<string>();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const [isPageSizeLoaded, setIsPageSizeLoaded] = React.useState(false);
  const [_pagination, _setPagination] = React.useState<PaginationState>({
    pageIndex: pagination?.current_page ? pagination?.current_page - 1 : 0,
    pageSize: pagination?.per_page ?? defaultPageSize,
  });

  // load page size from local storage before rendering
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSize = localStorage.getItem("pageSize");
      _setPagination((prev) => ({
        ...prev,
        pageSize: storedSize ? Number(storedSize) : defaultPageSize,
      }));
      setIsPageSizeLoaded(true);
    }
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: _setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      pagination: _pagination,
      sorting,
      columnFilters,
      globalFilter,
    },
    filterFns: customFilterFns,
  });

  // don't render if page size is not loaded
  if (!isPageSizeLoaded) return null;

  return (
    <div className="relative w-full space-y-3 overflow-visible">
      {typeof children === "function" ? children({ table }) : children}
      <div
        className={cn("border-border overflow-hidden rounded-lg border shadow-xs", className)}
        {...rest}
      >
        <Table className={cn("bg-card", fixed && "table-fixed")}>
          <TableHeader className="bg-muted-foreground/10 dark:bg-muted/30 overflow-hidden">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-foreground not-has-[*]:w-14 has-[*]:min-w-24"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() && controls.sorting ? (
                        <div
                          className={cn(header.column.getCanSort() && "flex h-full cursor-pointer items-center gap-2 select-none")}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            // Enhanced keyboard handling for sorting
                            if (header.column.getCanSort() && (e.key === "Enter" || e.key === " ")) {
                              e.preventDefault();
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: (
                              <ChevronUpIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="px-2">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Data tidak tersedia
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {controls.pagination && (
        <DataTablePaginations
          table={table}
          pagination={pagination}
        />
      )}
    </div>
  );
}
