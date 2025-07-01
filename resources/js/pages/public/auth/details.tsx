import { BookTextIcon } from "lucide-react";

export default function DetailsAccount() {
  return (
    <div className="dark:bg-accent flex size-full flex-col items-center justify-center gap-6 rounded-md bg-blue-100/80 p-10 max-md:hidden">
      <BookTextIcon className="dark:text-primary size-12 stroke-2 text-blue-700" />
      <h2 className="dark:text-accent-foreground text-center text-xl font-semibold tracking-wide text-balance text-blue-800">
        Enjoy the benefits of your account
      </h2>
      <ul className="*:text-accent-foreground/70 list-outside list-disc space-y-2 *:text-sm *:leading-relaxed *:text-pretty">
        <li>Take control of your bookings — easily modify or cancel them at your convenience.</li>
        <li>Book accommodation in no time by having your contact details filled in automatically.</li>
        <li>Keep track of your booking history and easily view information about your previous visits.</li>
      </ul>
    </div>
  );
}
