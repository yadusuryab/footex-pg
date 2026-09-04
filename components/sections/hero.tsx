"use client";

import Poster2 from "@/public/p3.jpeg";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IconSquareRoundedArrowRight } from "@tabler/icons-react";
import { RainbowButton } from "../ui/rainbow-button";
import { client } from "@/sanityClient";

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
        }`
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
    <div className="w-full md:max-w-[400px] mx-auto px-4 sm:px-6">
      <Link
        href={href}
        className="block relative group"
        onClick={() => setIsLoading(true)}
      >
        {/* Image Container with Skeleton */}
        <div className="relative bg-gray-100 rounded-3xl overflow-hidden">
          <Image
            src={imageSrc}
            alt={alt}
            width={800}
            height={400}
            className={`w-full h-auto transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${isLoading ? 'opacity-70' : ''}`}
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

        <div className="mt-2">
          <RainbowButton className=" w-full rounded-xl bg-black text-white transition-colors
            h-12 sm:h-14 md:h-16
            text-base sm:text-lg md:text-xl" size={'lg'} >
            Claim offer
            <IconSquareRoundedArrowRight/>
          </RainbowButton>
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