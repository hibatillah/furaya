import { cn } from "@/lib/utils";
import { EyeIcon, ImageOffIcon } from "lucide-react";

interface ImageContainerProps extends React.ComponentProps<"img"> {
  href?: string;
  imgClassName?: string;
}

export function ImageContainer(props: ImageContainerProps) {
  const { src, alt, className, imgClassName, href, ...rest } = props;

  function Container() {
    return (
      <div
        className={cn(
          "bg-accent group relative grid aspect-square h-20 w-20 flex-none place-items-center overflow-hidden rounded-sm border",
          className,
        )}
      >
        {src !== "" ? (
          <img
            src={src}
            alt={alt}
            className={cn("size-full bg-center object-cover brightness-90", imgClassName)}
            {...rest}
          />
        ) : (
          <ImageOffIcon className="text-muted-foreground stroke-1.5 size-5" />
        )}

        {/* show overlay to show image */}
        {href && (
          <div className="absolute inset-0 hidden items-center justify-center gap-2 bg-black/60 group-hover:flex">
            <EyeIcon className="size-5 text-white" />
            <span className="text-sm text-white">Lihat</span>
          </div>
        )}
      </div>
    );
  }

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Container />
    </a>
  ) : (
    <Container />
  );
}
