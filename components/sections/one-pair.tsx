"use client";

import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { RainbowButton } from "../ui/rainbow-button";

export function OnePairOfferCTA() {
  return (
    <>
      <style>{`
        @keyframes opo-float-a { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(18px,14px) scale(1.15); } }
        @keyframes opo-float-b { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-16px,-12px) scale(1.2); } }
        @keyframes opo-shimmer { 0% { transform: translateX(-150%) skewX(-20deg); } 100% { transform: translateX(350%) skewX(-20deg); } }
        @keyframes opo-pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(37,99,235,0.45); } 100% { box-shadow: 0 0 0 12px rgba(37,99,235,0); } }
        @keyframes opo-spin-slow { to { transform: rotate(360deg); } }
        @keyframes opo-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        @keyframes opo-bg-shift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .opo-card { background-size: 200% 200%; animation: opo-bg-shift 8s ease-in-out infinite; }
        .opo-blob-a { animation: opo-float-a 6s ease-in-out infinite; }
        .opo-blob-b { animation: opo-float-b 7s ease-in-out infinite; }
        .opo-shine { animation: opo-shimmer 3.2s ease-in-out infinite; }
        .opo-ring { animation: opo-pulse-ring 1.8s ease-out infinite; }
        .opo-spin { animation: opo-spin-slow 8s linear infinite; }
        .opo-bob { animation: opo-bob 2.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .opo-card, .opo-blob-a, .opo-blob-b, .opo-shine, .opo-ring, .opo-spin, .opo-bob { animation: none; }
        }
      `}</style>

      <Link
        href="/offer?pair=one"
        className="opo-card group relative block w-full max-w-xl mx-auto overflow-hidden rounded-3xl p-6 sm:p-7 shadow-[0_10px_30px_-10px_rgba(245,158,11,0.6)] ring-1 ring-amber-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-12px_rgba(245,158,11,0.75)] active:scale-[0.99]"
        style={{
          backgroundImage:
            "linear-gradient(120deg, #FEF08A 0%, #FDE047 30%, #FACC15 60%, #FBBF24 100%)",
        }}
      >
        {/* Abstract blobs (yellow shades) */}
        <div className="opo-blob-a pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-300/70 blur-2xl" />
        <div className="opo-blob-b pointer-events-none absolute -bottom-12 left-1/4 h-36 w-36 rounded-full bg-yellow-100/80 blur-2xl" />
        <div className="opo-blob-a pointer-events-none absolute right-1/3 top-1/2 h-24 w-24 rounded-full bg-orange-300/50 blur-2xl" />

        {/* Subtle dot texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(#B45309 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        {/* Shimmer sweep */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="opo-shine absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>

        {/* Big decorative sparkle */}
        <Sparkles
          className="opo-spin pointer-events-none absolute -right-3 bottom-3 h-28 w-28 text-white/40"
          strokeWidth={1}
        />

        <div className="relative flex flex-col gap-4">
          <span className="opo-bob inline-flex w-fit items-center gap-1.5 rounded-md bg-white/45 backdrop-blur-lg px-3 py-1 text-[11px] font-bold tracking-wide text-muted-foreground backdrop-blur">
            SINGLE PAIR DEAL
          </span>

          <div>
            <h3 className="text-3xl font-bold leading-tight tracking-tight text-black sm:text-4xl">
              1 Pair Offer
            </h3>
            <p className="mt-1 max-w-xs text-sm font-medium text-muted-foreground">
              Just need one? Grab it at a special price.
            </p>
          </div>

          <RainbowButton className="inline-flex w-fit items-center gap-2 rounded-full bg-white py-2 pl-5 pr-0 text-sm font-bold transition-all duration-300 group-hover:gap-3 text-white">
            Shop now
            <span className="opo-ring flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
            </span>
          </RainbowButton>
        </div>
      </Link>
    </>
  );
}