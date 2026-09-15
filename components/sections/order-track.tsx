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
    <Link
      href="/order/track"
      className="group relative flex w-full max-w-xl mx-auto overflow-hidden rounded-2xl bg-primary shadow-[0_1px_0_0_rgba(27,39,51,0.08)] ring-1 ring-[#1B2733]/10 transition-transform duration-200 hover:-translate-y-0.5"
    >
      {/* Stub side */}
      <div className="relative flex flex-col items-center justify-center gap-2 bg-secondary px-5 py-6 sm:px-6">
        <Truck className="h-6 w-6 text-[#EFE9DA]" strokeWidth={1.75} />
        <span
          className="text-[10px] tracking-[0.14em]  text-[#EFE9DA]/60"
          style={{ writingMode: "vertical-rl" }}
        >
          IN TRANSIT
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
        <div className="absolute -top-2 right-[-8px] h-4 w-4 rounded-full bg-white" />
        <div className="absolute -bottom-2 right-[-8px] h-4 w-4 rounded-full bg-white" />
      </div>

      {/* Main side */}
      <div className="flex flex-1 items-center justify-between gap-4 px-5 py-6 sm:px-7">
        <div className="min-w-0">
          <p className="font-bold text-[11px] tracking-wide text-[#C1502E]">
            WHERE&apos;S MY ORDER?
          </p>
          <p className="mt-1 text-lg font-semibold text-[#1B2733] sm:text-xl">
            Track your package
          </p>
          <p className="mt-0.5 text-sm text-[#1B2733]/60">
            Live status, carrier updates, and delivery estimate.
          </p>
        </div>

        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1B2733] text-[#EFE9DA] transition-transform duration-200 group-hover:translate-x-0.5">
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}