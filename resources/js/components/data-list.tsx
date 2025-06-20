import { cn } from "@/lib/utils";
import { Fragment } from "react/jsx-runtime";

interface DataListProps extends React.HTMLAttributes<HTMLDListElement> {
  data: {
    label: string;
    value: React.ReactNode | string | number | null | undefined;
  }[];
}

export function DataList(props: DataListProps) {
  const { data, className, ...rest } = props;

  return (
    <dl
      className={cn(
        "[&_dt]:text-foreground/70 [&_dd]:text-foreground grid gap-x-8 gap-y-2 [--columns:1] max-lg:gap-0.5 lg:grid-cols-[repeat(var(--columns),auto_1fr)] [&_dd]:max-lg:mb-2",
        className,
      )}
      {...rest}
    >
      {data.map((item) => (
        <Fragment key={item.label}>
          <dt data-label={item.label}>{item.label}</dt>
          <dd data-value={item.label}>{item.value ?? "-"}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
