import { Separator } from "@/components/ui/separator";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";

export default function NotFound() {
  return (
    <AppLayout>
      <Head title="Error" />
      <div className="flex h-full flex-col items-center justify-center gap-6">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-bold">404</h1>
          <Separator orientation="vertical" />
          <h2 className="text-muted-foreground text-xl">Halaman tidak ditemukan</h2>
        </div>
      </div>
    </AppLayout>
  );
}
