"use client";

import * as React from "react";
import { LabelList, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { chartColors } from "./utils";

export function ChartCountRoomType({ data }: { data: Record<string, number> }) {
  const chartData = React.useMemo(() => {
    return Object.entries(data).map(([roomType, count], index) => ({
      roomType,
      count,
      fill: chartColors[index % chartColors.length],
    }));
  }, [data]);

  const config = React.useMemo(() => {
    return Object.fromEntries(Object.keys(data).map((roomType) => [roomType.toLowerCase(), { label: roomType }]));
  }, [data]) satisfies ChartConfig;

  const total = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + Number(curr.count), 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col gap-2">
      <CardHeader className="items-center pb-0">
        <CardTitle>Jumlah Kamar</CardTitle>
        <CardDescription>Pembagian Kamar Berdasarkan Tipe</CardDescription>
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
              nameKey="roomType"
            >
              <LabelList
                dataKey="roomType"
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
        <span className="text-foreground font-bold">{total.toLocaleString()}</span>
        <span>Total Kamar</span>
      </CardFooter>
    </Card>
  );
}
