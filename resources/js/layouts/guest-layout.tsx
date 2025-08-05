import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Toaster } from "@/components/ui/sonner";
import { useMobileNavigation } from "@/hooks/use-mobile-navigation";
import { cn } from "@/lib/utils";
import PublicLogin from "@/pages/public/auth/login";
import PublicRegister from "@/pages/public/auth/register";
import { dateConfig } from "@/static";
import { FlashMessages, SharedData } from "@/types";
import { Link, router, usePage } from "@inertiajs/react";
import { addDays, format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { CalendarIcon, GiftIcon, LogOut, UserRoundIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

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
  const [promoCode, setPromoCode] = useState("");

  const [pax, setPax] = useState<Record<string, number>>({
    adults: adults ? Number(adults) : 1,
    children: children ? Number(children) : 0,
  });

  function handleDateReservation() {
    const start = date?.from ? format(date.from, "yyyy-MM-dd") : format(initialDate.from, "yyyy-MM-dd");
    const end = date?.to ? format(date.to, "yyyy-MM-dd") : format(addDays(initialDate.from, 1), "yyyy-MM-dd");

    const data = {
      start_date: start,
      end_date: end,
      adults: pax.adults,
      children: pax.children,
      promo_code: promoCode,
    };

    router.get(route("public.reservation"), data);
  }

  return (
    <Card className={cn("mx-auto w-fit p-4 ps-5 max-md:w-full lg:flex-row lg:gap-8", className)}>
      <CardHeader className="justify-center p-0">
        <CardTitle>Booking Online</CardTitle>
        <CardDescription>Akomodasi bergaransi</CardDescription>
      </CardHeader>
      <CardContent className="relative grid grid-cols-2 items-end gap-x-4 gap-y-3 p-0 lg:flex lg:flex-row">
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
                className="bg-accent w-36 justify-between gap-4 max-lg:w-full"
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
                className="bg-accent w-36 justify-between gap-4 max-lg:w-full"
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
        <div className="flex flex-col gap-1 max-sm:col-span-full">
          <Label
            htmlFor="pax"
            className="text-xs"
          >
            Pax
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="bg-accent max-lg:justify-between"
              >
                {pax.adults} Dewasa, {pax.children} Anak
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
                    Dewasa
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    value={pax.adults}
                    onIncrease={() => {
                      setPax((prev) => ({ ...prev, adults: prev.adults + 1 }));
                    }}
                    onDecrease={() => setPax((prev) => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                  />
                </div>

                {/* children */}
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="pax"
                    className="text-xs"
                  >
                    Anak
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={pax.children}
                    onIncrease={() => setPax({ ...pax, children: pax.children + 1 })}
                    onDecrease={() => setPax({ ...pax, children: pax.children > 0 ? pax.children - 1 : 0 })}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* code */}
        <div className="flex flex-col gap-1 max-sm:col-span-full">
          <Label
            htmlFor="room_type"
            className="text-xs"
          >
            Promo Code
          </Label>
          <div className="relative">
            <Input
              type="text"
              className="w-full pe-9 lg:w-40"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <span className="absolute inset-y-0 end-0 flex items-center px-3">
              <GiftIcon className="text-primary size-4" />
            </span>
          </div>
        </div>

        {/* submit */}
        <Button
          onClick={handleDateReservation}
          className="max-lg:col-span-full"
        >
          Cek Kamar
        </Button>
      </CardContent>
    </Card>
  );
}

function Profile({ className }: { className?: string }) {
  const { auth } = usePage<SharedData>().props;
  const isLoggedIn = auth.user !== null;
  const isGuest = auth.user?.role === "guest";

  const [loginDialog, setLoginDialog] = useState(false);
  const [registerDialog, setRegisterDialog] = useState(false);

  const cleanup = useMobileNavigation();

  const handleLogout = () => {
    cleanup();
    router.flushAll();

    toast.success("Berhasil logout");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("text-muted-foreground hover:text-foreground size-8", className)}
          >
            <UserRoundIcon />
            <span className="sr-only">Profile</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={2}
        >
          {isLoggedIn ? (
            <>
              <DropdownMenuItem asChild>
                <Link
                  href={route("public.profile.edit")}
                  className={cn(!isGuest && "hidden")}
                >
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={route("public.reservation.history")}
                  className={cn(!isGuest && "hidden")}
                >
                  Reservasi
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={route("dashboard")}
                  className={cn(isGuest && "hidden")}
                >
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                asChild
              >
                <Link
                  className="block w-full"
                  method="post"
                  href={route("logout")}
                  as="button"
                  onClick={handleLogout}
                >
                  <LogOut />
                  Log out
                </Link>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={() => setRegisterDialog(true)}>Register</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLoginDialog(true)}>Login</DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <PublicRegister state={[registerDialog, setRegisterDialog]} />
      <PublicLogin state={[loginDialog, setLoginDialog]} />
    </>
  );
}

function Header() {
  const menu = ["About Us", "Rooms", "Banquet & Events", "Facilities", "Offers", "Contact", "Map"];

  return (
    <header className="bg-background/90 border-border/50 sticky top-0 z-10 w-full border-b backdrop-blur-sm">
      <div className="container mx-auto flex items-center gap-0.5 px-4 py-2">
        <Link
          href={route("home")}
          className="text-foreground me-auto flex items-center gap-2"
        >
          <img
            src="/favicon.svg"
            alt="Furaya Hotel"
            className="size-8 object-contain text-current"
          />
          <span className="truncate leading-none font-semibold tracking-wide uppercase">Furaya Hotel</span>
        </Link>
        <nav className="flex items-center gap-0.5 max-lg:hidden">
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
        </nav>
        <ThemeToggle />
        <Profile />
      </div>
    </header>
  );
}

interface GuestLayoutProps {
  bookCard?: boolean;
  children: ReactNode;
  className?: string;
}

export default ({ children, className, bookCard = true }: GuestLayoutProps) => {
  const { flash } = usePage<{ flash?: FlashMessages }>().props;

  // handle flash messages
  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.warning) toast.warning(flash.warning);
    if (flash?.error) {
      toast.error("Terjadi Kesalahan", {
        description: flash.error,
      });
    }
  }, [flash?.success, flash?.error, flash?.warning]);

  return (
    <>
      <Header />
      <main className="p-5">
        {bookCard && <BookCard className="mb-10" />}
        {children}
      </main>
      <Toaster />
    </>
  );
};
