import { cn } from "@/lib/utils";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function CardChart(props: {
  title: string;
  value: React.ReactNode;
  valueDescription?: string;
  description?: string;
  className?: string;
}) {
  const { title, value, valueDescription, description, className } = props;

  return (
    <Card className={cn("flex flex-row justify-between gap-2 p-6", className)}>
      <CardHeader className="gap-0 p-0">
        <CardTitle className="text-foreground line-clamp-2 leading-snug font-semibold">{title}</CardTitle>
        <CardDescription className="text-muted-foreground break text-sm wrap-anywhere">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col justify-end gap-1 p-0">
        <div className="text-foreground text-[42px] leading-none font-semibold">{value}</div>
      </CardContent>
    </Card>

    // <Card className={cn("gap-3", className)}>
    //   <CardContent className="space-y-1">
    //     <h3 className="text-muted-foreground text-sm">{title}</h3>
    //     <div className="text-foreground flex items-baseline gap-1.5 text-4xl leading-none font-semibold">
    //       {value} {valueDescription && <span className="text-muted-foreground text-lg font-medium">{valueDescription}</span>}
    //     </div>
    //   </CardContent>
    //   <CardFooter className="text-muted-foreground text-sm">{description}</CardFooter>
    // </Card>
  );
}
