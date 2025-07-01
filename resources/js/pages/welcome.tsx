import GuestLayout from "@/layouts/guest-layout";
import { SharedData } from "@/types";
import { Head, usePage } from "@inertiajs/react";

export default function Welcome() {
  const { auth } = usePage<SharedData>().props;
  const username = auth.user?.name;

  return (
    <GuestLayout>
      <Head title="Hotel Furaya, Pekanbaru" />
      <div className="flex h-[70vh] items-center justify-center gap-5">
        <h1 className="text-2xl font-bold">Selamat Datang, {username}</h1>
      </div>
    </GuestLayout>
  );
}
