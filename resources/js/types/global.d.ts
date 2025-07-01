import type { route as routeFn } from "ziggy-js";

declare global {
  const route: typeof routeFn;

  interface Window {
    snap: any;
  }

  interface SelectData {
    value: string | null;
    label: string;
  }

  interface Pagination<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  }

  interface RoutesProps extends Record<string, string> {
    create: string;
    show: (id: string) => string;
    edit: (id: string) => string;
    destroy: (id: string) => string;
  }

  type DialogType = "delete" | "edit" | "detail";
}

declare module "@inertiajs/react" {
  interface PageProps {
    flash?: {
      success?: string;
      warning?: string;
      error?: string;
    };
  }
}
