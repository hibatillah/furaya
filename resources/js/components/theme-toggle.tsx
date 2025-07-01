import { Button } from "@/components/ui/button";
import { useAppearance } from "@/hooks/use-appearance";
import { cn } from "@/lib/utils";
import { MoonIcon, SunIcon } from "lucide-react";

export default function ThemeToggle({ className }: { className?: string }) {
  const { appearance, updateAppearance } = useAppearance();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("text-muted-foreground hover:text-foreground ml-auto size-8", className)}
      onClick={() => updateAppearance(appearance === "dark" ? "light" : "dark")}
      aria-label="Toggle Theme"
    >
      {appearance === "dark" ? <MoonIcon className="size-4" /> : <SunIcon className="size-4" />}
    </Button>
  );
}
