"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export function ChartCountGuestNationality({ data, className }: { data: Record<string, number>; className?: string }) {
  const chartData = React.useMemo(() => {
    return Object.entries(data).map(([nationality, count], index) => ({
      nationality,
      count,
    }));
  }, [data]);

  const chartConfig = React.useMemo(
    () => ({
      nationality: { label: "Kewarganegaraan" },
    }),
    [],
  );

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Distribusi Kewarganegaraan Tamu</CardTitle>
        <CardDescription>Distribusi nasionalitas tamu berdasarkan reservasi</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
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
              content={<ChartTooltipContent hideLabel />}
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
