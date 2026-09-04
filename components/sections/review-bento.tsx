"use client";

import Image from "next/image";
import Link from "next/link";

export function ReviewsBento() {
  return (
    <Link
      href="/reviews"
      className="group relative block w-full overflow-hidden rounded-2xl bg-neutral-950 border border-white/10 hover:border-white/20 transition-colors"
    >
      <div className="flex items-stretch">
        {/* Text side */}
        <div className="flex flex-col justify-center gap-2 p-6 md:p-8 w-1/2 z-10">
          <span className="text-xs uppercase tracking-wider text-purple-300">
            Customer Love
          </span>
          <h3 className="text-xl md:text-2xl font-semibold text-white">
            Happy Customers
          </h3>
          <p className="text-sm text-neutral-400">
            Real reviews from real people
          </p>
          <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-white/90 group-hover:gap-2 transition-all">
            View all reviews
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </div>

        {/* Preview images side */}
        <div className="relative w-1/2 flex gap-3 p-4 md:p-6">
          <div className="relative flex-1 aspect-[9/16] rounded-xl overflow-hidden shadow-lg -rotate-2 group-hover:rotate-0 transition-transform duration-300">
            <Image
              src="/reviews/1.jpg"
              alt="Customer review"
              fill
              className="object-cover"
              sizes="25vw"
            />
          </div>
          <div className="relative flex-1 aspect-[9/16] rounded-xl overflow-hidden shadow-lg translate-y-3 rotate-2 group-hover:rotate-0 group-hover:translate-y-0 transition-transform duration-300">
            <Image
              src="/reviews/2.jpg"
              alt="Customer review"
              fill
              className="object-cover"
              sizes="25vw"
            />
          </div>
        </div>
      </div>

      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl" />
    </Link>
  );
}