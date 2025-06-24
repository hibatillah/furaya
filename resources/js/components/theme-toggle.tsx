import { Button } from "@/components/ui/button";
import { useAppearance } from "@/hooks/use-appearance";
import { MoonIcon, SunIcon } from "lucide-react";

export default function ThemeToggle() {
  const { appearance, updateAppearance } = useAppearance();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="ml-auto size-8 text-muted-foreground hover:text-foreground"
      onClick={() => updateAppearance(appearance === "dark" ? "light" : "dark")}
      aria-label="Toggle Theme"
    >
      {appearance === "dark" ? <MoonIcon className="size-4" /> : <SunIcon className="size-4" />}
    </Button>
  );
}
