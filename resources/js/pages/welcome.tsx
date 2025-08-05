import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import GuestLayout from "@/layouts/guest-layout";
import { SharedData } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import Autoplay from "embla-carousel-autoplay";

import { ImageContainer } from "@/components/image";
import hompage1 from "@/static/images/homepage_1.png";
import hompage2 from "@/static/images/homepage_2.png";
import hompage3 from "@/static/images/homepage_3.png";
import { CoffeeIcon, ShirtIcon, ShoppingCartIcon } from "lucide-react";

export default function Welcome() {
  const { auth } = usePage<SharedData>().props;
  const username = auth.user?.name;

  const images = [hompage3, hompage2, hompage1];

  return (
    <GuestLayout>
      <Head title="Hotel Furaya, Pekanbaru" />
      <div className="space-y-4">
        <Carousel
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-lg"
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem
                key={index}
                className="overflow-hidden rounded-lg"
              >
                <Card className="h-[72vh] overflow-hidden !p-0">
                  <ImageContainer
                    src={image}
                    alt="homepage"
                    className="h-full w-full bg-bottom object-cover"
                    imgClassName="bg-bottom brightness-80"
                  />
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* overlay */}
          <div className="bg-background/20 dark:bg-background/50 absolute inset-0 z-10 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-zinc-800 dark:text-foreground text-3xl font-black uppercase">Furaya Hotel</h1>
              <p className="text-zinc-800 dark:text-foreground text-xl">Pekanbaru, Indonesia</p>
            </div>
          </div>
        </Carousel>

        <div className="py-16">
          <Card className="container mx-auto">
            <CardContent className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 **:[p]:text-balance">
              <div className="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-hairdryer-icon lucide-hairdryer text-primary mx-auto mb-2"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="2"
                  />
                  <path d="M18 11s-7 3-10 3A6 6 0 0 1 8 2c3 0 10 3 10 3Z" />
                  <path d="m18 5 4-2v10l-4-2" />
                  <path d="m7 13.9.8 5.1c.1.5.6 1 1.2 1h2c.6 0 .9-.4.8-1l-.9-5.5" />
                  <path d="M11.64 18s3.3-2 7.3-2a2 2 0 0 1 0 4H17a2 2 0 0 0-2 2" />
                </svg>
                <h3 className="text-card-foreground text-lg font-semibold">Natural Spa & Sauna</h3>
                <p className="text-muted-foreground text-sm">Healthy corner yang bermanfaat untuk kesehatan anda.</p>
              </div>

              <div className="text-center">
                <CoffeeIcon
                  className="text-primary mx-auto mb-2"
                  size={40}
                />
                <h3 className="text-card-foreground text-lg font-semibold">Senapelan Coffee Shop</h3>
                <p className="text-muted-foreground text-sm">Menu pilihan lezat dengan racikan koki profesional.</p>
              </div>

              <div className="text-center">
                <ShoppingCartIcon
                  className="text-primary mx-auto mb-2"
                  size={40}
                />
                <h3 className="text-card-foreground text-lg font-semibold">FuMart</h3>
                <p className="text-muted-foreground text-sm">Toko yang menyediakan berbagai kebutuhan sehari-hari.</p>
              </div>

              <div className="text-center">
                <ShirtIcon
                  className="text-primary mx-auto mb-2"
                  size={40}
                />
                <h3 className="text-card-foreground text-lg font-semibold">Laundry</h3>
                <p className="text-muted-foreground text-sm">Layanan cuci dan setrika pakaian dengan kualitas terbaik.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8 pt-12">
          <h2 className="text-center text-4xl font-semibold">Akomodasi</h2>
          <div className="grid h-96 grid-cols-1 lg:grid-cols-3">
            {images.map((image, index) => (
              <ImageContainer
                key={index}
                src={image}
                alt="homepage"
                className="h-full w-full rounded-none bg-bottom object-cover"
                imgClassName="bg-bottom brightness-80"
              />
            ))}
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}
