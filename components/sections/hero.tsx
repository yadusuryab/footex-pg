"use client";

import Poster2 from "@/public/p3.avif";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RainbowButton } from "../ui/rainbow-button";
import { client } from "@/sanityClient";
import { ArrowRight } from "lucide-react";

type BannerData = {
  imageUrl: string;
  link: string;
  title: string;
};

export function Hero() {
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [bannerFetched, setBannerFetched] = useState(false);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "banner" && isActive == true] | order(orderNumber asc)[0]{
          "imageUrl": image.asset->url,
          link,
          title
        }`,
      )
      .then((data) => setBanner(data))
      .catch(() => setBanner(null))
      .finally(() => setBannerFetched(true));
  }, []);

  const imageSrc = banner?.imageUrl || Poster2.src;
  const href = banner?.link || "/offer?price=1199";
  const alt = banner?.title || "BOGO at ₹999";

  if (!bannerFetched) {
    return (
      <div className="w-full md:max-w-[400px] mx-auto px-4 sm:px-6">
        <div className="relative bg-gray-100 rounded-3xl overflow-hidden aspect-[2/1] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <Link
        href={href}
        className="block relative group"
        onClick={() => setIsLoading(true)}
      >
        <div className="relative w-full bg-gray-300  from-blue-600  to-blue-500 p-2 rounded-3xl overflow-hidden">
          {/* Image with skeleton */}
          <div className="relative bg-gray-100 rounded-2xl overflow-hidden">
            <Image
              src={imageSrc}
              alt={alt}
              width={800}
              height={400}
              className={`w-full h-auto transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              } ${isLoading ? "opacity-70" : ""}`}
              priority
              quality={60}
              sizes="(max-width: 640px) 95vw, (max-width: 1024px) 80vw, 600px"
              onLoad={() => setImageLoaded(true)}
            />

            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Combined CTA: text + arrow, full width */}
          <div className="mt-2 flex w-full items-stretch overflow-hidden rounded-xl">
            <RainbowButton
              type="button"
              size="lg"
              className="h-12 sm:h-14 md:h-16 flex-1 min-w-0 rounded-none rounded-l-2xl text-xl text-white border-r border-white/30"
            >
              Claim offer
            </RainbowButton>
            <RainbowButton
              type="button"
              size="lg"
              aria-label="Claim offer"
              className="h-12 sm:h-14 md:h-16 aspect-square shrink-0 px-0 rounded-none rounded-r-2xl text-white"
            >
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </RainbowButton>
          </div>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-black/10 rounded-3xl flex items-center justify-center">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        )}
      </Link>
    </div>
  );
}