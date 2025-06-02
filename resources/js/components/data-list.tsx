import { cn } from "@/lib/utils";
import { Fragment } from "react/jsx-runtime";

interface DataListProps extends React.HTMLAttributes<HTMLDListElement> {
  data: {
    label: string;
    value: string | number | null | undefined;
  }[];
}

export function DataList(props: DataListProps) {
  const { data, className, ...rest } = props;

  return (
    <dl
      className={cn(
        "[&_dt]:text-foreground/70 [&_dd]:text-foreground grid grid-cols-[repeat(var(--columns),auto_1fr)] gap-x-8 gap-y-2 [--columns:1]",
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
