import { Row } from "@tanstack/react-table";
import { isSameYear, isWithinInterval } from "date-fns";

/**
 * Custom filter functions list.
 *
 * @description
 * - define filter name as key with it's filterFn as value.
 * - pass in `filterFns` at useReactTable options.
 */
export const customFilterFns = {
  checkbox: checkboxFilter,
  radio: radioFilter,
  "date-range": dateRangeFilter,
  "date-year": dateYearFilter,
};

/**
 * @private
 * Store filter function inside {customFilterFns}.
 */
function checkboxFilter<T>(
  row: Row<T>,
  columnId: string,
  filterValue: string[],
): boolean {
  if (!filterValue?.length) return true;
  const column = row.getValue(columnId) as string;
  return filterValue.includes(column);
}

/**
 * @private
 * Store filter function inside {customFilterFns}.
 */
function radioFilter<T>(
  row: Row<T>,
  columnId: string,
  filterValue: string,
): boolean {
  if (!filterValue) return true;
  const column = String(row.getValue(columnId));
  return String(filterValue) === column;
}

/**
 * @private
 * Store filter function inside {customFilterFns}.
 */
function dateRangeFilter<T>(
  row: Row<T>,
  columnId: string,
  filterValue: string[],
): boolean {
  if (!filterValue || filterValue.length !== 2) return true;

  const rowDate = new Date(row.getValue(columnId) as string);
  const from = new Date(filterValue[0]);
  const to = new Date(filterValue[1]);

  return isWithinInterval(rowDate, { start: from, end: to });
}

/**
 * @private
 * Store filter function inside {customFilterFns}.
 */
function dateYearFilter<T>(
  row: Row<T>,
  columnId: string,
  filterValue: string | undefined,
) {
  if (!filterValue) return true;
  const rowYear = new Date(row.getValue(columnId) as string);
  const selectedYear = new Date(Number(filterValue), 1, 1);
  return isSameYear(rowYear, selectedYear);
}
