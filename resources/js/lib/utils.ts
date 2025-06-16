import { router } from "@inertiajs/react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number,
  {
    locales,
    currency,
  }: {
    locales?: string;
    currency?: string;
  } = { locales: "id-ID", currency: "IDR" },
): string {
  const formatter = new Intl.NumberFormat(locales, {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
    compactDisplay: "short"
  });

  const formatted = formatter.format(value);
  return formatted;
}
