import Link from "next/link";
import type { CSSProperties } from "react";
import { IconBrandInstagram, IconMenu, IconX } from "@tabler/icons-react";
import { site } from "@/lib/site-config";
import Brand from "../../brand/brand";

import { ProductCardWithSale } from "../../sections/sale-is-live";
import { Stars } from "./stars";
import { MenuCloser } from "./menu-closer";

const MARQUEE = [
  "FREE FLAME SOCKS",
  "ALL INDIA DELIVERY",
  "BEST QUALITY ITEMS",
  "10K+ HAPPY CUSTOMERS",
];

const LINKS = [
  { label: "Track order", href: "/order/track" },
  { label: "Terms", href: "/T&C" },
  { label: "Privacy", href: "/privacy-policy" },
];

const css = `
:root{--mh:1.75rem;--ease:cubic-bezier(.16,1,.3,1)}
@media(min-width:640px){:root{--mh:2rem}}

#menu{clip-path:inset(0 0 100% 0);
  transition:clip-path .7s cubic-bezier(.76,0,.24,1),display .7s allow-discrete,overlay .7s allow-discrete}
#menu:popover-open{clip-path:inset(0)}
@starting-style{#menu:popover-open{clip-path:inset(0 0 100% 0)}}

#menu:popover-open .r>*{animation:rise .9s var(--ease) backwards;animation-delay:calc(.25s + var(--i)*.08s)}
@keyframes rise{from{transform:translateY(110%)}}
body:has(#menu:popover-open){overflow:hidden}

@supports(animation-timeline:scroll()){
  .hdr,.sale{animation:linear both;animation-timeline:scroll();animation-range:0 40px}
  .hdr{animation-name:hide-bar}
  .sale{animation-name:fold}
  @keyframes hide-bar{to{transform:translateY(calc(var(--mh)*-1))}}
  @keyframes fold{to{grid-template-rows:0fr;opacity:0}}
}
@media(prefers-reduced-motion:reduce){#menu,#menu *{animation:none!important;transition:none!important}}
`;

// Server component: zero client JS of its own. Only <MenuCloser/>, the sale gate and the countdown hydrate.
export default function Header() {
  return (
    <>
      <style>{css}</style>

      <div className="hdr fixed inset-x-0 top-0 z-40">
        <div className="flex h-7 items-center overflow-hidden bg-blue-500 text-white sm:h-8">
          <div className="flex animate-marquee whitespace-nowrap motion-reduce:animate-none">
            {[0, 1].map((g) => (
              <div
                key={g}
                aria-hidden={g ? true : undefined}
                className="flex shrink-0 items-center"
              >
                {MARQUEE.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-semibold tracking-tight sm:text-xs"
                  >
                    <span className="mx-3 sm:mx-4">{t}</span>
                    <span className="text-white/40">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <header className="bg-gradient-to-b from-primary via-[#fcd719] to-transparent">
          <div className="relative flex items-center justify-between p-3 px-4 sm:p-4 sm:px-6">
            <Stars />

            <button
              popoverTarget="menu"
              aria-label="Open menu"
              className="text-white"
            >
              <IconMenu className="" />
            </button>

            <Link
              href="/"
              aria-label="Footex Home"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Brand />
            </Link>

            <a
              href={`https://instagram.com/${site.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
              className="relative text-white"
            >
              <IconBrandInstagram className="size-7" />
            </a>
          </div>

          <div className="sale mx-auto grid w-full grid-rows-[1fr] md:max-w-[400px]">
            <div className="min-h-0 overflow-hidden">
              <ProductCardWithSale />
            </div>
          </div>
        </header>
      </div>

      <nav
        id="menu"
        popover="auto"
        aria-label="Menu"
        className="m-0 h-dvh w-dvw max-w-none overflow-hidden border-0 bg-primary p-0 text-black"
      >
        <MenuCloser />
        <button
          popoverTarget="menu"
          popoverTargetAction="hide"
          aria-label="Close menu"
          className="absolute left-4 top-4 grid size-8 place-items-center rounded-md  sm:left-6"
        >
          <IconX className="size-4" />
        </button>

        <div className="flex h-full flex-col justify-end gap-10 px-4 pb-8 sm:px-6">
          <ul>
            {LINKS.map(({ label, href }, i) => (
              <li
                key={href}
                className="r overflow-hidden border-t- border-secondary"
                style={{ "--i": i } as CSSProperties}
              >
                <Link
                  href={href}
                  className="block py-4 text-4xl text-black font-bold leading-[.88] tracking-[-0.06em] transition-[padding,color] duration-500 hover:pl-4 hover:text-blue-500 focus-visible:pl-4 focus-visible:text-blue-500"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div
            className="r overflow-hidden"
            style={{ "--i": LINKS.length } as CSSProperties}
          >
            <Link
              href={`https://instagram.com/${site.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <IconBrandInstagram className="size-6" />@{site.instagram}
            </Link>
          </div>
        </div>
      </nav>

      <div className="h-28 md:h-52 sm:h-28" />
    </>
  );
}
