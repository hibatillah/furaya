import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import { router } from "@inertiajs/react";

export function DataTablePaginations<TData>(props: { table: Table<TData>; pagination?: Pagination<TData> }) {
  const { table, pagination } = props;
  console.log(pagination);

  const pageSizeOpt = [10, 20, 30]; // Define the page size options
  const currentPage = pagination?.current_page ?? table.getState().pagination.pageIndex + 1;
  const totalPages = pagination?.last_page ?? Math.ceil(table.getRowCount() / table.getState().pagination.pageSize);

  function firstPage() {
    if (pagination?.first_page_url) {
      router.get(pagination.first_page_url);
    } else {
      table.firstPage();
    }
  }

  function lastPage() {
    if (pagination?.last_page_url) {
      router.get(pagination.last_page_url);
    } else {
      table.lastPage();
    }
  }

  function previousPage() {
    if (pagination?.prev_page_url) {
      router.get(pagination.prev_page_url);
    } else {
      table.previousPage();
    }
  }

  function nextPage() {
    if (pagination?.next_page_url) {
      router.get(pagination.next_page_url);
    } else {
      table.nextPage();
    }
  }

  function isFirstPage(): boolean {
    if (pagination?.first_page_url) {
      return currentPage === 1;
    } else {
      return !table.getCanPreviousPage();
    }
  }

  function isLastPage(): boolean {
    if (pagination?.last_page_url) {
      return currentPage === totalPages;
    } else {
      return !table.getCanNextPage();
    }
  }

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Results per page */}
      <div className="flex items-center gap-3">
        <Select
          value={table.getState().pagination.pageSize.toString()}
          onValueChange={(value) => {
            localStorage.setItem("pageSize", value);
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="w-fit whitespace-nowrap">
            <SelectValue placeholder="Select number of results" />
          </SelectTrigger>
          <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
            {pageSizeOpt.map((pageSize) => (
              <SelectItem
                key={pageSize}
                value={pageSize.toString()}
              >
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Label className="text-muted-foreground max-sm:sr-only">Baris per halaman</Label>
      </div>

      {/* Page number information */}
      <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
        <p
          className="text-muted-foreground text-sm whitespace-nowrap"
          aria-live="polite"
        >
          <span className="me-1">Halaman</span>
          <span className="text-foreground">{currentPage}</span>
          <span className="mx-1">/</span>
          <span className="text-foreground">{totalPages}</span>
        </p>
      </div>

      {/* Pagination buttons */}
      <div>
        <Pagination>
          <PaginationContent>
            {/* First page button */}
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="cursor-pointer disabled:pointer-events-none disabled:opacity-50"
                onClick={firstPage}
                disabled={isFirstPage()}
                aria-label="Go to first page"
              >
                <ChevronsLeftIcon
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Button>
            </PaginationItem>

            {/* Previous page button */}
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="cursor-pointer disabled:pointer-events-none disabled:opacity-50"
                onClick={previousPage}
                disabled={isFirstPage()}
                aria-label="Go to previous page"
              >
                <ChevronLeftIcon
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Button>
            </PaginationItem>

            {/* Next page button */}
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="cursor-pointer disabled:pointer-events-none disabled:opacity-50"
                onClick={nextPage}
                disabled={isLastPage()}
                aria-label="Go to next page"
              >
                <ChevronRightIcon
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Button>
            </PaginationItem>

            {/* Last page button */}
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="cursor-pointer disabled:pointer-events-none disabled:opacity-50"
                onClick={lastPage}
                disabled={isLastPage()}
                aria-label="Go to last page"
              >
                <ChevronsRightIcon
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
