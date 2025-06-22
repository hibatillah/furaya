"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { dateConfig } from "@/static";
import { eachDayOfInterval, format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { pieChartColors } from "./utils";

export function ChartDailyReservationVolume({ data, className }: { data: Record<string, number>; className?: string }) {
  const didMountRef = React.useRef(false);

  const groupedByYearMonth = React.useMemo(() => {
    return Object.entries(data).reduce<Record<string, Record<string, Record<string, number>>>>((acc, [dateKey, value]) => {
      const [year, month] = dateKey.split("-");
      if (!acc[year]) acc[year] = {};
      if (!acc[year][month]) acc[year][month] = {};
      acc[year][month][dateKey] = value;
      return acc;
    }, {});
  }, [data]);

  // compute default year and month together
  const { defaultYear, defaultMonth } = React.useMemo(() => {
    const now = new Date();
    const currentYear = format(now, "yyyy");
    const currentMonth = format(now, "MM");

    if (groupedByYearMonth[currentYear]?.[currentMonth]) {
      return { defaultYear: currentYear, defaultMonth: currentMonth };
    }

    // fallback to the latest year and its first month
    const years = Object.keys(groupedByYearMonth);
    const lastYear = years.at(-1)!;
    const months = Object.keys(groupedByYearMonth[lastYear]);
    return { defaultYear: lastYear, defaultMonth: months[0] };
  }, [groupedByYearMonth]);

  const [year, setYear] = React.useState(defaultYear);
  const [month, setMonth] = React.useState(defaultMonth);

  // when year changes, update month accordingly
  React.useEffect(() => {
    if (!groupedByYearMonth[year]?.[month]) {
      const months = Object.keys(groupedByYearMonth[year]);
      setMonth(months[0]);
    }
  }, [year]);

  // reset month if year changes
  React.useEffect(() => {
    if (didMountRef.current) {
      const months = Object.keys(groupedByYearMonth[year]);
      setMonth(months[0]);
    } else {
      didMountRef.current = true;
    }
  }, [year]);

  const chartData = React.useMemo(() => {
    const rawData = groupedByYearMonth?.[year]?.[month] || {};

    const yearNum = Number(year);
    const monthNum = Number(month); // month is already 1-based like in your state

    const start = new Date(yearNum, monthNum - 1, 1);
    const end = new Date(yearNum, monthNum, 0); // last day of the month

    const daysInMonth = eachDayOfInterval({ start, end });

    return daysInMonth.map((dateObj) => {
      const date = format(dateObj, "yyyy-MM-dd");

      return {
        date,
        Jumlah: rawData[date] ?? 0,
        fill: pieChartColors[pieChartColors.length - 1],
      };
    });
  }, [groupedByYearMonth, year, month]);

  const config = React.useMemo(() => {
    const days = groupedByYearMonth?.[year]?.[month] || {};
    return Object.fromEntries(Object.keys(days).map((date) => [date.toLowerCase(), { label: date }]));
  }, [groupedByYearMonth, year, month]) satisfies ChartConfig;

  return (
    <Card className={cn("flex flex-col gap-2", className)}>
      <CardHeader className="flex-row items-center justify-between pb-0">
        <div className="space-y-1">
          <CardTitle>Distribusi Reservasi Harian</CardTitle>
          <CardDescription>Jumlah reservasi per hari, {format(new Date(`${year}-${month}-01`), "MMMM yyyy", dateConfig)}</CardDescription>
        </div>
        <div className="flex gap-2">
          <Select
            value={year}
            onValueChange={setYear}
          >
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Pilih Tahun" />
            </SelectTrigger>
            <SelectContent align="end">
              {Object.keys(groupedByYearMonth).map((year) => (
                <SelectItem
                  key={year}
                  value={year}
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={month}
            onValueChange={setMonth}
          >
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent align="end">
              {Object.keys(groupedByYearMonth[year] || {}).map((month) => (
                <SelectItem
                  key={month}
                  value={month}
                >
                  {format(new Date(`${year}-${month}-01`), "MMMM", dateConfig)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={config}
          className="h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 30,
              left: 0,
              right: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => format(new Date(value), "dd", dateConfig)}
            />
            <YAxis
              dataKey="Jumlah"
              tickLine={false}
              axisLine={false}
              tickMargin={20}
              tickCount={4}
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelKey="date"
                  labelFormatter={(value) => {
                    return format(new Date(value), "dd MMMM yyyy", dateConfig);
                  }}
                />
              }
            />
            <Line
              dataKey="Jumlah"
              type="monotone"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={false}
              // dot={({ cx, cy, payload }) =>
              //   payload.Jumlah === 0 ? (
              //     (null as unknown as React.ReactElement)
              //   ) : (
              //     <circle
              //       cx={cx}
              //       cy={cy}
              //       r={4}
              //       stroke="var(--color-primary)"
              //       fill="var(--color-primary-foreground)"
              //     />
              //   )
              // }
              activeDot={{
                r: 4,
                fill: "var(--color-foreground)",
              }}
            >
              {/* <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: string) => {
                  if (value) return value;
                  return null;
                }}
              /> */}
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
