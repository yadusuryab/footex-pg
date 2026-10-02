"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, BadgeCheck } from "lucide-react";

export function ReviewsBento() {
  return (
    <Link
      href="/reviews"
      className="group relative block w-full overflow-hidden rounded-2xl border border-[#D4AF37]/60 bg-gradient-to-br from-neutral-950 via-neutral-900 to-purple-950 shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-300 hover:border-[#D4AF37] hover:shadow-[0_0_28px_rgba(212,175,55,0.35)]"
    >
      {/* glow blobs */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-purple-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-yellow-400/10 blur-3xl" />

      <div className="relative flex items-stretch">
        {/* Text side */}
        <div className="z-10 flex w-1/2 flex-col justify-center gap-2 p-5 md:p-8">
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] backdrop-blur-sm">
            <BadgeCheck className="size-3" /> Customer Love
          </span>

          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="size-3.5 text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.7)]"
                fill="currentColor"
              />
            ))}
          </div>

          <h3 className="text-xl font-black leading-tight tracking-tight text-white md:text-2xl">
            Happy <span className="text-[#D4AF37]">Customers</span>
          </h3>
          <p className="text-xs text-neutral-400 md:text-sm">
            Real reviews from real people
          </p>

          <span className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 px-3 py-1.5 text-xs font-bold text-black transition-all group-hover:gap-2.5">
            View all reviews
            <ArrowRight className="size-3.5" />
          </span>
        </div>

        {/* Preview images side */}
        <div className="relative flex max-h-56 w-1/2 gap-3 overflow-hidden p-4 md:p-6">
          <div className="relative aspect-[9/16] flex-1 -rotate-3 overflow-hidden rounded-xl border-2 border-[#D4AF37]/70 shadow-xl transition-transform duration-300 group-hover:-rotate-1 group-hover:scale-105">
            <Image
              src="/reviews/1.jpg"
              alt="Customer review"
              fill
              className="object-cover"
              sizes="25vw"
            />
          </div>
          <div className="relative aspect-[9/16] flex-1 translate-y-4 rotate-3 overflow-hidden rounded-xl border-2 border-[#D4AF37]/70 shadow-xl transition-transform duration-300 group-hover:translate-y-1 group-hover:rotate-1 group-hover:scale-105">
            <Image
              src="/reviews/2.jpg"
              alt="Customer review"
              fill
              className="object-cover"
              sizes="25vw"
            />
          </div>
          {/* fade into text side */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-neutral-950/80 to-transparent" />
        </div>
      </div>
    </Link>
  );
}