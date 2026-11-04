import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Poster from "@/public/h-500.avif";
import { client } from "@/sanityClient";
import { RainbowButton } from "../ui/rainbow-button";
import { LinkPending } from "./link-pending";

type Banner = { imageUrl?: string; link?: string; title?: string } | null;

const query = `*[_type == "banner" && isActive == true] | order(orderNumber asc)[0]{
  "imageUrl": image.asset->url, link, title
}`;

// Same design as before. Server component: the banner is fetched and cached on the
// server, so the image is in the first HTML (no skeleton wait, no client fetch).
const cta = "motion-reduce:animate-none motion-reduce:before:animate-none h-12 sm:h-14 md:h-16";

export async function Hero() {
  const banner = await client
    .fetch<Banner>(query, {}, { next: { revalidate: 300 } })
    .catch(() => null);

  return (
    <Link href={banner?.link || "/offer?price=1199"} className="relative block">
      <div className="relative w-full overflow-hidden rounded-3xl bg-gray-300 p-2">
        <div className="relative overflow-hidden rounded-2xl bg-gray-100">
          <Image
            src={banner?.imageUrl || Poster}
            alt={banner?.title || "BOGO at ₹999"}
            width={300}
            height={300}
            priority
          
            sizes="(max-width: 767px) 100vw, 400px"
            className="h-auto w-full"
          />
        </div>

        {/* Split CTA: text + arrow. asChild renders <span>s, so no <button> inside the <a> */}
        <div className="mt-2 flex w-full items-stretch overflow-hidden rounded-xl">
          <RainbowButton
            asChild
            size="lg"
            className={`${cta} min-w-0 flex-1 rounded-none rounded-l-2xl border-r border-white/30 text-xl text-white`}
          >
            <span>Claim offer</span>
          </RainbowButton>
          <RainbowButton
            asChild
            size="lg"
            className={`${cta} aspect-square shrink-0 rounded-none rounded-r-2xl px-0 text-white`}
          >
            <span aria-hidden>
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
          </RainbowButton>
        </div>
      </div>

      <LinkPending />
    </Link>
  );
}