import { Button } from "@/components/ui/button";
import GuestLayout from "@/layouts/guest-layout";
import { SharedData } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";

export default function Welcome() {
  const { auth } = usePage<SharedData>().props;
  const isLoggedIn = auth.user !== null;

  return (
    <GuestLayout>
      <Head title="Hotel Furaya, Pekanbaru" />
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <Button asChild>
          {isLoggedIn ? (
            <Link href={route("dashboard")}>Dashboard</Link>
          ) : (
            <Link href={route("login")}>Login</Link>
          )}
        </Button>
      </div>
    </GuestLayout>
  );
}
