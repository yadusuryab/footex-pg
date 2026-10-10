"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, PenLine } from "lucide-react";
import { Button } from "../ui/button";

export function ReviewsBento() {
  return (
    <Link href="/reviews" className="group relative block w-full">
    <div
      className="
        group relative block w-full overflow-hidden rounded-2xl
        border border-[#D4AF37]/60
        bg-gradient-to-r from-blue-600 via-purple-600 to-purple-400
        transition-all duration-300
        hover:border-[#D4AF37]
        hover:shadow-[0_0_28px_rgba(212,175,55,0.35)]
      "
    >
      {/* Animated Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Blue Glow */}
        <div
          className="
            absolute -left-20 -top-20
            h-48 w-48
            rounded-full
            bg-cyan-300/30
            blur-3xl
            transition-transform
            duration-[5000ms]
            ease-in-out
            group-hover:translate-x-20
            group-hover:translate-y-10
          "
        />

        {/* Purple Glow */}
        <div
          className="
            absolute -bottom-20 -right-20
            h-56 w-56
            rounded-full
            bg-fuchsia-400/30
            blur-3xl
            transition-transform
            duration-[6000ms]
            ease-in-out
            group-hover:-translate-x-16
            group-hover:-translate-y-10
          "
        />

        {/* Grid Texture */}
        <div
          className="
            absolute inset-0
            opacity-[0.12]
            bg-[linear-gradient(rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)]
            bg-[size:24px_24px]
          "
        />

        {/* Dot Texture */}
        <div
          className="
            absolute inset-0
            opacity-[0.18]
            bg-[radial-gradient(rgba(255,255,255,0.7)_0.7px,transparent_0.7px)]
            bg-[size:6px_6px]
          "
        />

        {/* Diagonal Light */}
        <div
          className="
            absolute
            -left-1/2
            top-0
            h-full
            w-1/3
            rotate-[20deg]
            bg-gradient-to-r
            from-transparent
            via-white/10
            to-transparent
            blur-xl
            transition-transform
            duration-[2500ms]
            ease-in-out
            group-hover:translate-x-[500%]
          "
        />
      </div>

      {/* Main Content */}
      <div className="relative flex items-stretch">
        {/* Text */}
        <div className="z-10 flex w-1/2 flex-col justify-center gap-2 p-5 md:p-8">
          {/* Stars */}
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="size-3.5 text-white"
                fill="currentColor"
              />
            ))}
          </div>

          {/* Heading */}
          <h3 className="text-xl font-black leading-tight tracking-tight text-white md:text-2xl">
            Happy Customers
          </h3>

          {/* Description */}
          <p className="text-xs font-semibold text-white/90 md:text-sm">
            Real reviews from real people
          </p>
        </div>

        {/* Review Images */}
        <div className="relative flex max-h-56 w-1/2 gap-3 overflow-hidden p-4 md:p-6">
          {/* Image 1 */}
          <div
            className="
              relative aspect-[9/16] flex-1 -rotate-3
              overflow-hidden rounded-xl
              border-2 border-[#D4AF37]/70
              shadow-xl
              transition-all duration-500
              group-hover:-rotate-1
              group-hover:scale-105
            "
          >
            <Image
              src="/reviews/1.jpg"
              alt="Customer review"
              fill
              className="object-cover"
              sizes="25vw"
            />
          </div>

          {/* Image 2 */}
          <div
            className="
              relative aspect-[9/16] flex-1 translate-y-4 rotate-3
              overflow-hidden rounded-xl
              border-2 border-[#D4AF37]/70
              shadow-xl
              transition-all duration-500
              group-hover:translate-y-1
              group-hover:rotate-1
              group-hover:scale-105
            "
          >
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

      {/* CTA */}
      <div
        className="
          relative flex items-center justify-between
          gap-3 border-t border-white/10
          bg-black/20 px-1 py-1
          backdrop-blur-sm

        "
      >
        {/* Read Reviews */}
        <Link
          href="/reviews"
          className="
            inline-flex items-center
            text-xs font-bold uppercase tracking-wide
            text-white
            transition-all duration-200
            hover:translate-x-0.5
            hover:text-white/80
            md:text-sm
            px-4
          "
        >
          Read Reviews
          <ArrowRight className="ml-1 size-4" />
        </Link>

        {/* Divider */}
        <span className="h-5 w-px bg-white/30" />

        {/* Write Review */}
        <Button
      className="bg-white rounded-md rounded-br-xl text-xs font-semibold" size="sm"
        >
          <PenLine className="size-3.5 md:size-4" />
          Write a Review
        </Button>
      </div>
    </div>
    </Link>
  );
}