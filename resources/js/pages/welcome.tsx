import { Button } from "@/components/ui/button";
import { SharedData } from "@/types";
import { Link, usePage } from "@inertiajs/react";

export default function Welcome() {
  const { auth } = usePage<SharedData>().props;
  const isLoggedIn = auth.user !== null;

  return (
    <div className="h-screen grid place-items-center">
      <Button asChild>
        {isLoggedIn ? (
          <Link href={route("dashboard")}>Dashboard</Link>
        ) : (
          <Link href={route("login")}>Login</Link>
        )}
      </Button>
    </div>
  );
}
