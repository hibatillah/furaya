export default function DetailsAccount() {
  return (
    <div className="dark:bg-accent flex size-full flex-col items-center justify-center gap-6 rounded-md bg-blue-100/80 p-10 max-md:hidden">
      <div className="flex flex-col items-center gap-2">
        <img
          src="/favicon.svg"
          alt="Furaya Hotel"
          className="size-16 object-contain text-current"
        />
        <h2 className="dark:text-accent-foreground text-center text-xl font-semibold tracking-wide text-balance text-blue-800">Furaya Hotel</h2>
      </div>
      <p className="text-accent-foreground/70 text-sm leading-normal text-pretty text-center">
        Untuk perjalanan bisnis, liburan akhir pekan, atau sekadar singgah di Pekanbaru, Hotel Furaya adalah pilihan yang tepat tanpa membuat kantong
        jebol. Hotel Furaya menawarkan beragam fasilitas mulai dari kafe 24 jam, mini market 24 jam, lounge, spa dan pusat kebugaran, karaoke
        dengan ruangan privat, layanan laundry, fasilitas bisnis dan perjamuan, agen perjalanan, hingga restoran yang menyajikan perpaduan lezat
        masakan Indonesia, internasional, dan Chinese.
      </p>
    </div>
  );
}
