import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

export function ImageContainer({ src, alt, className, ...rest }: React.ComponentProps<"img">) {
  return (
    <div className={cn("bg-accent grid aspect-square size-20 flex-none place-items-center overflow-hidden rounded-sm border", className)}>
      {src !== "" ? (
        <img
          src={src}
          alt={alt}
          className="size-full object-cover brightness-90"
          {...rest}
        />
      ) : (
        <ImageIcon className="text-muted-foreground stroke-1.5 size-5" />
      )}
    </div>
  );
}
