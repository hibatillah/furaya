import { router } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function navigate(
  url: string,
  {
    options,
    delay = 2000,
  }: {
    options?: Parameters<typeof router.visit>[1];
    delay?: number;
  } = {},
) {
  setTimeout(() => router.visit(url, options), delay);
}
