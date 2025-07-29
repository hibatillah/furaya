import { FormatOptions } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export const dateConfig: FormatOptions = {
  locale: idLocale,
  weekStartsOn: 1,
};

type color = "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose" | "slate" | "stone";

export const badgeColor = {
  red: "bg-red-100 border-red-300 text-red-800 dark:bg-red-950 dark:border-red-900 dark:text-red-200",
  orange: "bg-orange-100 border-orange-300 text-orange-800 dark:bg-orange-950 dark:border-orange-900 dark:text-orange-200",
  amber: "bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-950 dark:border-amber-900 dark:text-amber-200",
  yellow: "bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-900 dark:text-yellow-200",
  lime: "bg-lime-100 border-lime-300 text-lime-800 dark:bg-lime-950 dark:border-lime-900 dark:text-lime-200",
  green: "bg-green-100 border-green-300 text-green-800 dark:bg-green-950 dark:border-green-900 dark:text-green-200",
  emerald: "bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-900 dark:text-emerald-200",
  teal: "bg-teal-100 border-teal-300 text-teal-800 dark:bg-teal-950 dark:border-teal-900 dark:text-teal-200",
  cyan: "bg-cyan-100 border-cyan-300 text-cyan-800 dark:bg-cyan-950 dark:border-cyan-900 dark:text-cyan-200",
  sky: "bg-sky-100 border-sky-300 text-sky-800 dark:bg-sky-950 dark:border-sky-900 dark:text-sky-200",
  blue: "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-200",
  indigo: "bg-indigo-100 border-indigo-300 text-indigo-800 dark:bg-indigo-950 dark:border-indigo-900 dark:text-indigo-200",
  violet: "bg-violet-100 border-violet-300 text-violet-800 dark:bg-violet-950 dark:border-violet-900 dark:text-violet-200",
  purple: "bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-950 dark:border-purple-900 dark:text-purple-200",
  fuchsia: "bg-fuchsia-100 border-fuchsia-300 text-fuchsia-800 dark:bg-fuchsia-950 dark:border-fuchsia-900 dark:text-fuchsia-200",
  pink: "bg-pink-100 border-pink-300 text-pink-800 dark:bg-pink-950 dark:border-pink-900 dark:text-pink-200",
  rose: "bg-rose-100 border-rose-300 text-rose-800 dark:bg-rose-950 dark:border-rose-900 dark:text-rose-200",
  slate: "bg-slate-100 border-slate-300 text-slate-800 dark:bg-slate-950 dark:border-slate-900 dark:text-slate-200",
  stone: "bg-stone-100 border-stone-300 text-stone-800 dark:bg-stone-900 dark:border-stone-700 dark:text-stone-300",
} satisfies Record<color, string>
