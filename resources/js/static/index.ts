import { FormatOptions } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export const dateConfig: FormatOptions = {
  locale: idLocale,
  weekStartsOn: 1,
};

export const badgeColor = [
  "bg-blue-200 border-blue-400 text-blue-950 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-100",
  "bg-cyan-200 border-cyan-400 text-cyan-950 dark:bg-cyan-950 dark:border-cyan-900 dark:text-cyan-100",
  "bg-emerald-200 border-emerald-400 text-emerald-950 dark:bg-emerald-950 dark:border-emerald-900 dark:text-emerald-100",
  "bg-indigo-200 border-indigo-400 text-indigo-950 dark:bg-indigo-950 dark:border-indigo-900 dark:text-indigo-100",
  "bg-red-200 border-red-400 text-red-950 dark:bg-red-950 dark:border-red-900 dark:text-red-100",
  "bg-yellow-200 border-yellow-400 text-yellow-950 dark:bg-yellow-950 dark:border-yellow-900 dark:text-yellow-100",
  "bg-lime-200 border-lime-400 text-lime-950 dark:bg-lime-950 dark:border-lime-900 dark:text-lime-100",
  "bg-violet-200 border-violet-400 text-violet-950 dark:bg-violet-950 dark:border-violet-900 dark:text-violet-100",
  "bg-fuchsia-200 border-fuchsia-400 text-fuchsia-950 dark:bg-fuchsia-950 dark:border-fuchsia-900 dark:text-fuchsia-100",
  "bg-orange-200 border-orange-400 text-orange-950 dark:bg-orange-950 dark:border-orange-900 dark:text-orange-100",
  "bg-slate-200 border-slate-400 text-slate-950 dark:bg-slate-950 dark:border-slate-900 dark:text-slate-100",
  "bg-stone-200 border-stone-400 text-stone-950 dark:bg-stone-950 dark:border-stone-900 dark:text-stone-100",
];
