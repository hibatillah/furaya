"use client";

import * as React from "react";
import { LabelList, Pie, PieChart, Sector } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { pieChartColors } from "./utils";

export function ChartCountSmokingTypeReservation({ data, className }: { data: Record<string, number>; className?: string }) {
  const dataToUse = data || {};

  const chartData = React.useMemo(() => {
    return Object.entries(dataToUse).map(([smokingType, count], index) => ({
      smokingType,
      count,
      fill: pieChartColors[index % pieChartColors.length],
    }));
  }, [dataToUse]);

  const config = React.useMemo(() => {
    return Object.fromEntries(Object.keys(dataToUse).map((smokingType) => [smokingType.toLowerCase(), { label: smokingType }]));
  }, [dataToUse]) satisfies ChartConfig;

  const total = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + Number(curr.count), 0);
  }, [chartData]);

  const highestIndex = React.useMemo(() => {
    return chartData.reduce((highestIndex, currentItem, currentIndex) => {
      return currentItem.count > chartData[highestIndex].count ? currentIndex : highestIndex;
    }, 0);
  }, [chartData]);

  return (
    <Card className={cn("flex flex-col gap-2", className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Distribusi Smoking Type</CardTitle>
        <CardDescription className="text-center text-pretty">Tipe kamar direservasi berdasarkan smoking type</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              label={{
                fill: "var(--color-foreground)",
              }}
              data={chartData}
              dataKey="count"
              nameKey="smokingType"
              activeIndex={highestIndex}
              activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                <Sector
                  {...props}
                  outerRadius={outerRadius + 10}
                />
              )}
            >
              <LabelList
                dataKey="smokingType"
                className="fill-black"
                stroke="none"
                fontSize={12}
                offset={10}
                // formatter={(value: number) => {
                //   const percentage = (value / total) * 100;
                //   return `${percentage.toFixed(0)}%`;
                // }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
