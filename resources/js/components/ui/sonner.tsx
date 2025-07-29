import { useAppearance } from "@/hooks/use-appearance"
import { CircleCheckIcon, InfoIcon, LoaderIcon, OctagonAlertIcon, TriangleAlertIcon } from "lucide-react"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { appearance } = useAppearance()

  return (
    <Sonner
      theme={appearance as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-500" />,
        info: <InfoIcon className="size-4 text-blue-500" />,
        warning: <TriangleAlertIcon className="size-4 text-yellow-500" />,
        error: <OctagonAlertIcon className="size-4 text-red-500" />,
        loading: (
          <LoaderIcon className="text-muted-foreground duration-1500 size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--sidebar)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      richColors
      {...props}
    />
  )
}

export { Toaster }
