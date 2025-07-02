"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { dateConfig } from "@/static";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { pieChartColors } from "./utils";

export function ChartMonthlyReservationVolume({ data, className }: { data: Record<string, number>; className?: string }) {
  const dataToUse = data || {};

  const groupedByYear = Object.entries(dataToUse).reduce<Record<string, Record<string, number>>>((acc, [monthKey, value]) => {
    const [year, month] = monthKey.split("-");
    if (!acc[year]) {
      acc[year] = {};
    }
    acc[year][monthKey] = value;
    return acc;
  }, {});

  // compute default year and month together
  const { defaultYear } = React.useMemo(() => {
    if (!data) return { defaultYear: "" };

    // get current year
    const now = new Date();
    const currentYear = format(now, "yyyy");

    if (groupedByYear[currentYear]) {
      return { defaultYear: currentYear };
    }

    // fallback to the latest year
    const years = Object.keys(groupedByYear);
    const lastYear = years.at(-1) || "";
    return { defaultYear: lastYear };
  }, [groupedByYear]);

  const [year, setYear] = React.useState<keyof typeof groupedByYear>(defaultYear);

  const chartData = React.useMemo(() => {
    const yearData = groupedByYear[year] || {};
    return Object.entries(yearData).map(([date, count]) => ({
      date,
      count,
      fill: pieChartColors[pieChartColors.length - 1],
    }));
  }, [dataToUse, year]);

  const config = React.useMemo(() => {
    return {
      ...Object.fromEntries(Object.keys(dataToUse).map((date) => [date.toLowerCase(), { label: date }])),
      count: { label: "Jumlah" },
    };
  }, [dataToUse]) satisfies ChartConfig;

  return (
    <Card className={cn("flex flex-col gap-2", className)}>
      <CardHeader className="flex-row items-center justify-between pb-0">
        <div className="space-y-1">
          <CardTitle>Distribusi Reservasi Tahun {year}</CardTitle>
          <CardDescription>Jumlah reservasi per bulan</CardDescription>
        </div>
        <Select
          value={year}
          onValueChange={(value) => setYear(value as keyof typeof groupedByYear)}
        >
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="Pilih Tahun" />
          </SelectTrigger>
          <SelectContent align="end">
            {Object.keys(groupedByYear).map((year) => (
              <SelectItem
                key={year}
                value={year}
              >
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={config}
          className="h-full w-full"
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
              tickFormatter={(value) => format(new Date(value), "MMM", dateConfig)}
            />
            <YAxis
              dataKey="count"
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
                    return format(new Date(value), "MMMM yyyy", dateConfig);
                  }}
                />
              }
            />
            <Line
              dataKey="count"
              type="linear"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-primary)",
              }}
              activeDot={{
                r: 4,
                fill: "var(--color-foreground)",
              }}
            ></Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
