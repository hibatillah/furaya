"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { barChartColors } from "./utils";

export function ChartCountGuestReservation({ data, className }: { data: Record<string, number>; className?: string }) {
  const dataToUse = data || {};

  const chartData = React.useMemo(() => {
    return Object.entries(dataToUse).map(([name, count], index) => ({
      name,
      count,
      fill: index % 2 === 0 ? barChartColors[4] : barChartColors[6],
    }));
  }, [dataToUse]);

  const config = React.useMemo(() => {
    return {
      ...Object.fromEntries(Object.keys(dataToUse).map((name) => [name.toLowerCase(), { label: name }])),
      count: { label: "Jumlah" },
    };
  }, [dataToUse]) as ChartConfig;

  const highest = React.useMemo(() => {
    return Object.entries(dataToUse).reduce(
      (acc, [name, count]) => {
        return count > acc.count ? { name, count } : acc;
      },
      { name: "", count: 0 },
    );
  }, [dataToUse]);

  return (
    <Card className={cn("flex h-full flex-col gap-2", className)}>
      <CardHeader>
        <CardTitle>Top Tamu Berdasarkan Reservasi</CardTitle>
        <CardDescription>Tamu yang paling sering melakukan reservasi</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={config}
          className="h-full min-h-[100px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              top: 10,
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis
              dataKey="count"
              type="number"
              hide
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="count"
              layout="vertical"
              radius={4}
            >
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                className="fill-white font-medium"
                fontSize={12}
              />
              <LabelList
                dataKey="count"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
