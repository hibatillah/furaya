export default function AppLogo() {
  return (
    <>
      <div className="flex aspect-square size-8 items-center justify-center">
        <img
          src="/favicon.svg"
          alt="Furaya Hotel"
          className="size-8 object-contain text-current"
        />
      </div>
      <div className="ml-1 flex-1 text-left">
        <span className="truncate leading-none font-semibold uppercase tracking-wide">Furaya Hotel</span>
        <p className="text-foreground/80 text-sm font-light truncate leading-none">Pekanbaru, Indonesia</p>
      </div>
    </>
  );
}
