import { Separator } from "@/components/ui/separator";
import { Head } from "@inertiajs/react";

export default function Error({ status, message }: { status: number; message: string }) {
  console.error("System Error\n", { status, message });

  return (
    <>
      <Head title="Error" />
      <div className="flex h-dvh flex-col items-center justify-center gap-6">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-bold">{status}</h1>
          <Separator orientation="vertical" />
          <div>
            <h2 className="text-muted-foreground text-xl">Terjadi Kesalahan</h2>
            <p className="text-muted-foreground/60 text-xs">See browser console</p>
          </div>
        </div>
      </div>
    </>
  );
}
