import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { dateConfig } from "@/static";
import { Link, router, usePage } from "@inertiajs/react";
import { addDays, format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { CalendarIcon, GiftIcon, UserRoundIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { DateRange } from "react-day-picker";

function BookCard({ className }: { className?: string }) {
  const { startDate, endDate, adults, children } = usePage<{
    startDate: string;
    endDate: string;
    adults: number;
    children: number;
  }>().props;

  const initialDate = {
    from: startDate ? new Date(startDate) : new Date(),
    to: endDate ? new Date(endDate) : addDays(new Date(), 1),
  };

  const [date, setDate] = useState<DateRange | undefined>(initialDate);

  const [pax, setPax] = useState<Record<string, number>>({
    adults: adults ?? 1,
    children: children ?? 0,
  });

  function handleDateReservation() {
    const data = {
      start_date: date?.from ? new Date(date.from).toISOString() : initialDate.from.toISOString(),
      end_date: date?.to ? new Date(date.to).toISOString() : initialDate.to.toISOString(),
      adults: pax.adults,
      children: pax.children,
      promo_code: "",
    };

    router.get(route("public.reservation"), data);
  }

  return (
    <Card className={cn("mx-auto w-fit flex-row gap-8 p-4 ps-5", className)}>
      <CardHeader className="justify-center p-0">
        <CardTitle>Book Online</CardTitle>
        <CardDescription>Guaranteed Accommodation</CardDescription>
      </CardHeader>
      <CardContent className="relative flex flex-row items-end gap-3 p-0">
        {/* date picker component */}
        <Popover>
          {/* start date */}
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="start_date"
              className="text-xs"
            >
              Check In
            </Label>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="gap-4"
              >
                {date?.from ? format(date.from, "PP", dateConfig) : "Pick a date"}
                <CalendarIcon className="text-primary" />
              </Button>
            </PopoverTrigger>
          </div>

          {/* end date */}
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="end_date"
              className="text-xs"
            >
              Check Out
            </Label>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="gap-4"
              >
                {date?.to ? format(date.to, "PP", dateConfig) : "Pick a date"}
                <CalendarIcon className="text-primary" />
              </Button>
            </PopoverTrigger>
          </div>

          <PopoverContent
            align="center"
            sideOffset={7}
            className="w-fit p-0"
          >
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              classNames={{
                day_button: "size-10",
              }}
              locale={idLocale}
              disabled={{ before: new Date() }}
            />
          </PopoverContent>
        </Popover>

        {/* pax */}
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="pax"
            className="text-xs"
          >
            Pax
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {pax.adults} Adults, {pax.children} Children
                <UserRoundIcon className="text-primary" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="center"
              className="w-60 space-y-2 p-3"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <h3 className="text-sm">Jumlah Tamu</h3>
              <div className="flex items-center justify-between gap-3">
                {/* adults */}
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="pax"
                    className="text-xs"
                  >
                    Adults
                  </Label>
                  <Input
                    type="number"
                    value={pax.adults}
                    onIncrease={() => setPax({ ...pax, adults: pax.adults + 1 })}
                    onDecrease={() => setPax({ ...pax, adults: pax.adults - 1 })}
                  />
                </div>

                {/* children */}
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="pax"
                    className="text-xs"
                  >
                    Children
                  </Label>
                  <Input
                    type="number"
                    value={pax.children}
                    onIncrease={() => setPax({ ...pax, children: pax.children + 1 })}
                    onDecrease={() => setPax({ ...pax, children: pax.children - 1 })}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* code */}
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="room_type"
            className="text-xs"
          >
            Promo Code
          </Label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter your code"
              className="w-40 pe-9"
            />
            <span className="absolute inset-y-0 end-0 flex items-center px-3">
              <GiftIcon className="text-primary size-4" />
            </span>
          </div>
        </div>

        {/* submit */}
        <Button onClick={handleDateReservation}>Book Now</Button>
      </CardContent>
    </Card>
  );
}

interface GuestLayoutProps {
  bookCard?: boolean;
  children: ReactNode;
  className?: string;
}

export default ({ children, className, bookCard = true }: GuestLayoutProps) => {
  const menu = ["About Us", "Rooms", "Banquet & Events", "Facilities", "Offers", "Contact", "Map"];

  return (
    <>
      <header className="bg-background border-border sticky top-0 z-100 w-full border-b">
        <div className="container mx-auto flex items-center justify-between gap-5 px-4 py-2">
          <Link
            href={route("home")}
            className="text-foreground/80 tracking-wide uppercase"
          >
            Hotel Furaya
          </Link>
          <nav className="flex items-center gap-1">
            {menu.map((item) => (
              <Button
                key={item}
                type="button"
                variant="link"
                size="sm"
                className="text-muted-foreground hover:text-foreground cursor-default text-xs uppercase hover:no-underline"
              >
                {item}
              </Button>
            ))}
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="p-5">
        {bookCard && <BookCard className="mb-10" />}
        {children}
      </main>
      <Toaster />
    </>
  );
};
