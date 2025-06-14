import { FormatOptions } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export const dateConfig: FormatOptions = {
  locale: idLocale,
  weekStartsOn: 1,
};

export const badgeColor = [
  "bg-blue-400 text-blue-900 dark:bg-blue-900 dark:text-blue-100",
  "bg-cyan-400 text-cyan-900 dark:bg-cyan-900 dark:text-cyan-100",
  "bg-emerald-400 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100",
  "bg-indigo-400 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-100",
  "bg-red-400 text-red-900 dark:bg-red-900 dark:text-red-100",
  "bg-yellow-400 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100",
  "bg-lime-400 text-lime-900 dark:bg-lime-900 dark:text-lime-100",
  "bg-violet-400 text-violet-900 dark:bg-violet-900 dark:text-violet-100",
  "bg-fuchsia-400 text-fuchsia-900 dark:bg-fuchsia-900 dark:text-fuchsia-100",
  "bg-orange-400 text-orange-900 dark:bg-orange-900 dark:text-orange-100",
  "bg-slate-400 text-slate-900 dark:bg-slate-900 dark:text-slate-100",
  "bg-stone-400 text-stone-900 dark:bg-stone-900 dark:text-stone-100",
];