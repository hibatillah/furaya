"use client";

import * as React from "react";
import { LabelList, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { pieChartColors } from "./utils";

export function ChartReservationStatusDistribution({ data, className }: { data: Record<string, number>; className?: string }) {
  const dataToUse = data || {};

  const chartData = React.useMemo(() => {
    return Object.entries(dataToUse).map(([bedType, count], index) => ({
      bedType,
      count,
      fill: pieChartColors[index % pieChartColors.length],
    }));
  }, [dataToUse]);

  const config = React.useMemo(() => {
    return Object.fromEntries(Object.keys(dataToUse).map((bedType) => [bedType.toLowerCase(), { label: bedType }]));
  }, [dataToUse]) satisfies ChartConfig;

  const totalType = Object.keys(dataToUse).length;

  const total = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + Number(curr.count), 0);
  }, [chartData]);

  return (
    <Card className={cn("flex flex-col gap-2", className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Status Reservasi Mendatang</CardTitle>
        <CardDescription className="text-center text-pretty">Pembagian status untuk reservasi mendatang</CardDescription>
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
              nameKey="bedType"
            >
              <LabelList
                dataKey="bedType"
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
