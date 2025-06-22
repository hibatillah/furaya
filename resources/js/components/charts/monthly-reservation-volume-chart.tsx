"use client";

import * as React from "react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { dateConfig } from "@/static";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { pieChartColors } from "./utils";

export function ChartMonthlyReservationVolume({ data, className }: { data: Record<string, number>; className?: string }) {
  const groupedByYear = Object.entries(data).reduce<Record<string, Record<string, number>>>((acc, [monthKey, value]) => {
    const [year, month] = monthKey.split("-");
    if (!acc[year]) {
      acc[year] = {};
    }
    acc[year][monthKey] = value;
    return acc;
  }, {});

  const [year, setYear] = React.useState<keyof typeof groupedByYear>(Object.keys(groupedByYear).at(-1) as keyof typeof groupedByYear);

  const chartData = React.useMemo(() => {
    return Object.entries(groupedByYear[year]).map(([date, count]) => ({
      date,
      Jumlah: count,
      fill: pieChartColors[pieChartColors.length - 1],
    }));
  }, [data, year]);

  const config = React.useMemo(() => {
    return Object.fromEntries(Object.keys(data).map((date) => [date.toLowerCase(), { label: date }]));
  }, [data]) satisfies ChartConfig;

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
                    return format(new Date(value), "MMMM yyyy", dateConfig);
                  }}
                />
              }
            />
            <Line
              dataKey="Jumlah"
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
            >
              {/* <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              /> */}
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
