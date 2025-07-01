"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { barChartColors } from "./utils";

export function ChartCountFacilityUsed({ data, className }: { data: Record<string, number>; className?: string }) {
  const dataToUse = data || {};

  const chartData = React.useMemo(() => {
    return Object.entries(dataToUse).map(([facility, count], index) => ({
      facility,
      count,
      fill: index % 2 === 0 ? barChartColors[5] : barChartColors[8],
    }));
  }, [dataToUse]);

  const config = React.useMemo(() => {
    return {
      ...Object.fromEntries(Object.keys(dataToUse).map((facility) => [facility.toLowerCase(), { label: facility }])),
      count: { label: "Jumlah" },
    };
  }, [dataToUse]) as ChartConfig;

  const highest = React.useMemo(() => {
    return Object.entries(dataToUse).reduce(
      (acc, [facility, count]) => {
        return count > acc.count ? { facility, count } : acc;
      },
      { facility: "", count: 0 },
    );
  }, [dataToUse]);

  return (
    <Card className={cn("flex h-full flex-col gap-2", className)}>
      <CardHeader>
        <CardTitle>Top Fasilitas Kamar</CardTitle>
        <CardDescription>Fasilitas terbanyak digunakan berdasarkan kamar</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={config}
          className="max-h-[250px] min-h-[100px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="facility"
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
                dataKey="facility"
                position="insideLeft"
                offset={8}
                className="fill-white"
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
