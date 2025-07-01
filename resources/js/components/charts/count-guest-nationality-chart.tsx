"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export function ChartCountGuestNationality({ data, className }: { data: Record<string, number>; className?: string }) {
  const dataToUse = data || {};

  const chartData = React.useMemo(() => {
    return Object.entries(dataToUse).map(([nationality, count], index) => ({
      nationality,
      count,
    }));
  }, [dataToUse]);

  const config = React.useMemo(() => {
    return {
      ...Object.fromEntries(Object.keys(dataToUse).map((nationality) => [nationality.toLowerCase(), { label: nationality }])),
      count: { label: "Jumlah" },
    };
  }, [dataToUse]) as ChartConfig;

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Distribusi Kewarganegaraan Tamu</CardTitle>
        <CardDescription>Distribusi nasionalitas tamu berdasarkan reservasi</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={config}
          className="h-full min-h-[100px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="nationality"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="count"
              fill="var(--color-primary)"
              radius={8}
            >
              <LabelList
                position="top"
                offset={12}
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
