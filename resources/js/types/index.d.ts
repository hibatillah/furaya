import { LucideIcon } from "lucide-react";
import type { Config } from "ziggy-js";

export interface Auth {
  user: User;
  role: string;
}

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon | null;
  isActive?: boolean;
}

export interface NavCollapsibleItem extends NavItem {
  items?: NavItem[];
}

export interface SharedData {
  name: string;
  url: string;
  quote: { message: string; author: string };
  auth: Auth;
  ziggy: Config & { location: string };
  sidebarOpen: boolean;
  [key: string]: unknown;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  role_id?: string;
  role?: Role.Default;
  created_at: string;
  updated_at: string;
  [key: string]: unknown; // This allows for additional properties...
}

export interface FlashMessages {
  success?: string;
  warning?: string;
  error?: string;
  [key: string]: any; // Allow extra keys if needed
}

export interface MidtransResult {
  transaction_id: string;
  transaction_time: string;
  transaction_status: string;
  payment_type: string;
  snap_token: string;
  bank: string;
}
