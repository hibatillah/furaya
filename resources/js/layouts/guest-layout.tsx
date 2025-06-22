import FurayaLogo from "@/static/images/furaya_logo.png";
import HalalLogo from "@/static/images/halal_logo.png";
import PesonaLogo from "@/static/images/pesona_indonesia_logo.png";
import PHRILogo from "@/static/images/phri_logo.png";
import { Link } from "@inertiajs/react";
import { type ReactNode } from "react";

interface GuestLayoutProps {
  children: ReactNode;
  className?: string;
}

export default ({ children, className }: GuestLayoutProps) => {
  return (
    <>
      <header className="flex w-full items-center justify-between gap-5 px-8 py-2 not-dark:bg-white">
        <Link href={route("home")}>
          <img
            src={FurayaLogo}
            alt="Furaya Logo"
            className="h-12 object-contain dark:brightness-90"
          />
        </Link>

        <div className="flex items-center gap-1">
          <img
            src={HalalLogo}
            alt="Halal Logo"
            className="size-12 dark:brightness-90"
          />
          <img
            src={PHRILogo}
            alt="PHRI Logo"
            className="size-12 rounded-full bg-white p-1 dark:brightness-90"
          />
          <img
            src={PesonaLogo}
            alt="Pesona Indonesia Logo"
            className="h-12 bg-white object-contain  dark:brightness-90"
          />
        </div>
      </header>
      <main>{children}</main>
    </>
  );
};
