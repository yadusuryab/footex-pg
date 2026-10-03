"use client";

import Link from "next/link";
import { Truck, ArrowRight } from "lucide-react";

/**
 * OrderTrackCTA
 * A shipping-label / boarding-pass styled card linking to /order/track.
 * Drop this wherever you want the tracking prompt to live (e.g. in
 * app/page.tsx between sections, or in the footer/header).
 */
export function OrderTrackCTA() {
  return (
   <div className="p-0 md:p-0 bg-gray-200 rounded-2xl ">
     <Link
      href="/order/track"
      className="group relative flex w-full max-w-xl mx-auto  overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-violet-600 shadow-[0_1px_0_0_rgba(27,39,51,0.08)] ring-1 ring-[#1B2733]/10 transition-transform duration-200 hover:-translate-y-0.5"
    >
      {/* Stub side */}
      <div className="relative flex flex-col items-center justify-center gap-2 k px-5 py-1 sm:px-6">
        <Truck className="h-6 w-6 text-[#EFE9DA]" strokeWidth={1.75} />
        <span
          className="text-[10px] font-semibold  text-white"
          style={{ writingMode: "vertical-rl" }}
        >
          TRACK ORDER
        </span>

        {/* Perforation */}
        <div className="absolute right-0 top-0 h-full w-px">
          <div
            className="h-full w-px"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, #EFE9DA 0 6px, transparent 6px 12px)",
            }}
          />
        </div>
        {/* Notches */}
        <div className="absolute -top-2 right-[-8px] h-4 w-4 rounded-full bg-gray-200" />
        <div className="absolute -bottom-2 right-[-8px] h-4 w-4 rounded-full bg-gray-200" />
      </div>

      {/* Main side */}
      <div className="flex flex-1 items-center justify-between gap-4 px-5 py-3 sm:px-7">
        <div className="min-w-0">
          <p className="font-bold bg-white w-fit px-1.5 py-0.5 rounded-md text-[10px] tracking-tight text-black ">
            TRACK PACKAGE
          </p>
          <p className="mt-1 text-lg font-semibold text-white sm:text-lg">
            WHERE&apos;S MY ORDER?
          </p>
          <p className="mt-0.5 text-sm font-semibold text-white/60">
            Live status, carrier updates, and delivery estimate.
          </p>
        </div>

        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-200 group-hover:translate-x-0.5">
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>
    </Link>
   </div>
  );
}