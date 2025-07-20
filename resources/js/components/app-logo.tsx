import { HotelIcon } from "lucide-react";

export default function AppLogo() {
  return (
    <>
      <div className="bg-sidebar-accent text-sidebar-foreground flex aspect-square size-8 items-center justify-center rounded-md">
        <HotelIcon className="size-5 text-current" />
      </div>
      <div className="ml-1 grid flex-1 text-left text-sm">
        <span className="mb-0.5 truncate leading-none font-semibold">Hotel Furaya</span>
      </div>
    </>
  );
}
