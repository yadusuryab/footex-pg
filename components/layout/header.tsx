"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

// ✅ OPTIMIZED: Use static import for icons instead of dynamic
import {
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import { site } from "@/lib/site-config";
import Brand from "../brand/brand";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

// ✅ OPTIMIZED: Lazy load brand component with smaller fallback

const MARQUEE_ITEMS = [
  "FREE FLAME SOCKS",
  "ALL INDIA DELIVERY",
  "BEST QUALITY ITEMS",
  "10K+ HAPPY CUSTOMERS",
];

const MENU_LINKS = [
  { label: "Terms & Conditions", href: "/T&C" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

// ✅ How far the user must scroll before the marquee hides
const SCROLL_HIDE_THRESHOLD = 40;

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [marqueeHidden, setMarqueeHidden] = useState(false);

  // ✅ Lock body scroll while the full-page menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // ✅ Hide marquee once the page scrolls past the threshold, show again near the top
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        setMarqueeHidden(window.scrollY > SCROLL_HIDE_THRESHOLD);
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Marquee Bar — slides up + fades out smoothly on scroll */}
      <div
        className={`fixed top-0 z-50 w-full h-7 sm:h-8 bg-secondary text-white overflow-hidden flex items-center transition-all duration-500 ease-in-out ${
          marqueeHidden
            ? "-translate-y-full opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 2 }).map((_, groupIdx) => (
            <div key={groupIdx} className="flex items-center shrink-0">
              {MARQUEE_ITEMS.map((item, i) => (
                <span
                  key={`${groupIdx}-${i}`}
                  className="flex items-center text-[10px] sm:text-xs font-semibold tracking-tight"
                >
                  <span className="mx-3 sm:mx-4">{item}</span>
                  <span className="text-white/40">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main Header — moves up to top-0 once marquee is hidden */}
      <header
        className={`fixed z-40 w-full transition-[top] duration-500 ease-in-out ${
          marqueeHidden ? "top-0" : "top-7 sm:top-8"
        }`}
      >
        <div className="relative flex items-center justify-end bg-primary/75 backdrop-blur-xl p-3 px-4 sm:p-4 sm:px-6">
          {/* ✅ Logo — absolutely centered, independent of left/right content widths */}
          <Link
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2"
            aria-label="Footex Home"
          >
            <Suspense
              fallback={<div className="w-6 h-6 bg-gray-200 animate-pulse" />}
            >
              <Brand />
            </Suspense>
          </Link>

          {/* Social links */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href={`https://instagram.com/${site.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant={"secondary"}
                size="icon"
                className="w-8 h-8 transition-transform hover:scale-110"
                aria-label="Follow us on Instagram"
              >
                <IconBrandInstagram className="w-4 h-4" />
              </Button>
            </Link>
            <Link
              href={`https://wa.me/${site.phone}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant={"secondary"}
                size="icon"
                className="w-8 h-8 transition-transform hover:scale-110"
                aria-label="Contact us on WhatsApp"
              >
                <IconBrandWhatsapp className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ✅ Menu toggle button — rendered at the TOP level (not inside header),
          so its z-index competes globally and always wins over the overlay.
          Also tracks the header's top offset so it stays aligned. */}
      <div
        className={`fixed z-[40] w-full p-3 px-4 sm:p-4 sm:px-6 pointer-events-none transition-[top] duration-500 ease-in-out ${
          marqueeHidden ? "top-0" : "top-7 sm:top-8"
        }`}
      >
        <Button
          variant={"secondary"}
          size="icon"
          className="w-8 h-8 relative pointer-events-auto"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <IconMenu2
            className={`w-4 h-4 absolute transition-all duration-300 ${
              menuOpen
                ? "opacity-0 rotate-90 scale-50"
                : "opacity-100 rotate-0 scale-100"
            }`}
          />
          <IconX
            className={`w-4 h-4 absolute transition-all duration-300 ${
              menuOpen
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 -rotate-90 scale-50"
            }`}
          />
        </Button>
      </div>

      {/* ✅ Full-page menu overlay */}
      <div
        className={`fixed inset-0 z-[30] bg-primary text-white transition-opacity duration-300 ease-in-out ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`flex h-full flex-col items-center justify-center gap-2 px-6 transition-transform duration-500 ease-out ${
            menuOpen ? "translate-y-0" : "-translate-y-6"
          }`}
        >
          <nav className="flex flex-col items-center gap-6 sm:gap-8">
            {MENU_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  transitionDelay: menuOpen ? `${i * 75 + 100}ms` : "0ms",
                }}
                className={`text-2xl sm:text-3xl font-semibold tracking-tight transition-all duration-300 ease-out hover:text-white/70 ${
                  menuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 mt-10">
            <Link
              href={`https://instagram.com/${site.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
              className="text-white/80 hover:text-white transition-colors"
            >
              <IconBrandInstagram className="w-5 h-5" />
            </Link>
            <Link
              href={`https://wa.me/${site.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact us on WhatsApp"
              className="text-white/80 hover:text-white transition-colors"
            >
              <IconBrandWhatsapp className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ✅ Spacer accounts for marquee + header */}
      <div className="h-24 sm:h-28" />
    </>
  );
};

export default Header;