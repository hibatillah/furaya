"use client";

import * as React from "react";
import { LabelList, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { chartColors } from "./utils";

export function ChartCountUserRole({ data }: { data: Record<Enum.Role, number> }) {
  const chartData = React.useMemo(
    () => [
      { role: "manajer", count: data.manager, fill: chartColors[0] },
      { role: "admin", count: data.admin, fill: chartColors[1] },
      { role: "karyawan", count: data.employee, fill: chartColors[2] },
      { role: "tamu", count: data.guest, fill: chartColors[3] },
    ],
    [data],
  );

  const config = React.useMemo(
    () => ({
      count: { label: "Count" },
      manajer: { label: "Manajer" },
      admin: { label: "Admin" },
      karyawan: { label: "Karyawan" },
      tamu: { label: "Tamu" },
    }),
    [],
  ) satisfies ChartConfig;

  const total = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + Number(curr.count), 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col gap-2">
      <CardHeader className="items-center pb-0">
        <CardTitle>Jumlah Pengguna</CardTitle>
        <CardDescription>Pembagian Pengguna Berdasarkan Role</CardDescription>
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
              nameKey="role"
            >
              <LabelList
                dataKey="role"
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
        <span>total pengguna</span>
      </CardFooter>
    </Card>
  );
}
