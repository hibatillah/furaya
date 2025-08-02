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
    compactDisplay: "short",
  });

  const formatted = formatter.format(value);
  return formatted;
}

export async function imageUrlToFile(url: string, filename: string = "image.jpg") {
  const res = await fetch(url);
  const blob = await res.blob();

  // Use the blob to create a File
  const file = new File([blob], filename, {
    type: blob.type,
    lastModified: Date.now(),
  });

  return file;
}

export async function fetchImageMetadata(urls: string[]) {
  const results = await Promise.all(
    urls.map(async (url) => {
      const filename = url.split("/").at(-1) ?? "unknown.jpg";

      const res = await fetch(url);
      const blob = await res.blob();

      const file = new File([blob], filename, {
        type: blob.type,
        lastModified: Date.now(),
      });

      return {
        name: file.name,
        size: file.size,
        type: file.type,
        url,
        id: file.name,
        file,
      };
    }),
  );

  return results;
}

/**
 * Get country image url from flagcdn
 *
 * @param code - country code
 * @returns country image url
 */
export function getCountryImgUrl(code: string) {
  const url = `https://flagcdn.com/w40/${code}.webp`;
  return url;
}

export function getTimeFormat(datetime: Date) {
  const hours = String(datetime.getHours()).padStart(2, "0");
  const minutes = String(datetime.getMinutes()).padStart(2, "0");
  const seconds = String(datetime.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}
