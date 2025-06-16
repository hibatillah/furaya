"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { barChartColors } from "./utils";

// export function ChartMostUsedFacility({ data, className }: { data: Record<string, number>; className?: string }) {
//   const chartData = React.useMemo(() => {
//     return Object.entries(data).map(([facility, count], index) => ({
//       facility,
//       count,
//       fill: barChartColors[index % barChartColors.length],
//     }));
//   }, [data]);

//   const config = React.useMemo(() => {
//     return Object.fromEntries(Object.keys(data).map((facility) => [facility.toLowerCase(), { label: facility }]));
//   }, [data]) satisfies ChartConfig;

//   const highest = React.useMemo(() => {
//     return Object.entries(data).reduce(
//       (acc, [facility, count]) => {
//         return count > acc.count ? { facility, count } : acc;
//       },
//       { facility: "", count: 0 },
//     );
//   }, [data]);

//   return (
//     <Card className={cn("flex flex-col gap-2", className)}>
//       <CardHeader>
//         <CardTitle>Penggunaan Fasilitas Kamar</CardTitle>
//         <CardDescription>Fasilitas terbanyak digunakan berdasarkan kamar</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer
//           config={config}
//           className="w-full"
//         >
//           <BarChart
//             accessibilityLayer
//             data={chartData}
//             margin={{
//               top: 25,
//               bottom: 5,
//             }}
//           >
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="facility"
//               tickLine={false}
//               tickMargin={20}
//               axisLine={false}
//               angle={-20}
//               tickFormatter={(value) => value.split(" ")[0]}
//               hide={true}
//             />
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent />}
//             />
//             <Bar
//               dataKey="count"
//               fill="var(--color-teal-500)"
//               radius={8}
//             >
//               <LabelList
//                 position="top"
//                 offset={12}
//                 className="fill-foreground"
//                 fontSize={12}
//               />
//             </Bar>
//           </BarChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="text-muted-foreground mt-2 flex items-center justify-center gap-1">
//         <span className="text-foreground">{highest.facility}</span>
//         <span>sebagai pilihan terbanyak, digunakan sebanyak</span>
//         <span className="text-foreground">{highest.count} kali</span>
//       </CardFooter>
//     </Card>
//   );
// }

export function ChartMostUsedFacility({ data, className }: { data: Record<string, number>; className?: string }) {
  const chartData = React.useMemo(() => {
    return Object.entries(data).map(([facility, count], index) => ({
      facility,
      count,
      fill: index % 2 === 0 ? barChartColors[4] : barChartColors[7],
    }));
  }, [data]);

  const config = React.useMemo(() => {
    return {
      ...Object.fromEntries(
        Object.keys(data).map((facility) => [facility.toLowerCase(), { label: facility }])
      ),
      count: { label: "Jumlah" }
    };
  }, [data]) as ChartConfig;

  const highest = React.useMemo(() => {
    return Object.entries(data).reduce(
      (acc, [facility, count]) => {
        return count > acc.count ? { facility, count } : acc;
      },
      { facility: "", count: 0 },
    );
  }, [data]);

  return (
    <Card className={cn("flex flex-col gap-2 h-full", className)}>
      <CardHeader>
        <CardTitle>Top Fasilitas Kamar</CardTitle>
        <CardDescription>Fasilitas terbanyak digunakan berdasarkan kamar</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="max-h-[300px] min-h-[100px] w-full">
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
                className="fill-foreground"
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
      <CardFooter className="text-muted-foreground mt-2 flex items-center justify-center gap-1">
        <span className="text-foreground">{highest.facility}</span>
        <span>sebagai pilihan terbanyak, digunakan sebanyak</span>
        <span className="text-foreground">{highest.count} kali</span>
      </CardFooter>
    </Card>
  );
}
