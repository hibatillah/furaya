"use client";

import * as React from "react";
import { LabelList, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { pieChartColors } from "./utils";

export function ChartCountBedType({ data, className }: { data: Record<string, number>; className?: string }) {
  const chartData = React.useMemo(() => {
    return Object.entries(data).map(([bedType, count], index) => ({
      bedType,
      count,
      fill: pieChartColors[index % pieChartColors.length],
    }));
  }, [data]);

  const config = React.useMemo(() => {
    return Object.fromEntries(Object.keys(data).map((bedType) => [bedType.toLowerCase(), { label: bedType }]));
  }, [data]) satisfies ChartConfig;

  const totalType = Object.keys(data).length;

  const total = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + Number(curr.count), 0);
  }, [chartData]);

  return (
    <Card className={cn("flex flex-col gap-2", className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Jumlah Penggunaan Kasur</CardTitle>
        <CardDescription className="text-center text-pretty">Pembagian Penggunaan Tipe Kasur Berdasarkan Kamar</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="bedType"
            >
              <LabelList
                dataKey="bedType"
                className="fill-background"
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
      <CardFooter className="text-muted-foreground flex justify-center gap-2">
        <span className="text-foreground font-bold">{totalType}</span>
        <span>Tipe kasur pada</span>
        <span className="text-foreground font-semibold">{total.toLocaleString()}</span>
        <span>kamar.</span>
      </CardFooter>
    </Card>
  );
}
