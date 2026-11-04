import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PenLine } from "lucide-react";

const shot =
  "relative aspect-[9/16] flex-1 overflow-hidden rounded-xl border-2 border-[#D4AF37]/70 shadow-xl transition-transform duration-500 group-hover:scale-105";

const tilts = [
  "-rotate-3 group-hover:-rotate-1",
  "translate-y-4 rotate-3 group-hover:translate-y-1 group-hover:rotate-1",
];

// Server component, one <a> for the whole card (no nested links or buttons).
export function ReviewsBento() {
  return (
    <Link
      href="/reviews"
      className="group relative block w-full overflow-hidden rounded-2xl border border-[#D4AF37]/60 bg-gradient-to-r from-blue-600 via-purple-600 to-purple-400 text-white transition-shadow duration-300 hover:border-[#D4AF37] hover:shadow-[0_0_28px_rgba(212,175,55,0.35)]"
    >
      {/* One static dot texture replaces the blurred glows, grid and light sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.7)_0.7px,transparent_0.7px)] bg-[size:6px_6px] opacity-20"
      />

      <div className="relative flex items-stretch">
        <div className="flex w-1/2 flex-col justify-center gap-2 p-5 md:p-8">
          <span
            role="img"
            aria-label="5 out of 5 stars"
            className="text-sm leading-none tracking-wider"
          >
            ★★★★★
          </span>
          <h3 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
            Happy Customers
          </h3>
          <p className="text-xs font-semibold text-white/90 md:text-sm">
            Real reviews from real people
          </p>
        </div>

        <div className="flex max-h-56 w-1/2 gap-3 overflow-hidden p-4 md:p-6">
          {tilts.map((tilt, i) => (
            <div key={i} className={`${shot} ${tilt}`}>
              <Image
                src={`/reviews/${i + 1}-96.avif`}
                alt="Customer review"
                fill
                sizes="96px"
                quality={60}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex items-center justify-between gap-3 border-t border-white/10 bg-black/20 p-1">
        <span className="inline-flex items-center px-4 text-xs font-bold uppercase tracking-wide transition-transform group-hover:translate-x-0.5 md:text-sm">
          Read Reviews
          <ArrowRight className="ml-1 size-4" />
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md rounded-br-xl bg-white px-3 py-1.5 text-xs font-semibold text-black">
          <PenLine className="size-3.5 md:size-4" />
          Write a Review
        </span>
      </div>
    </Link>
  );
}
