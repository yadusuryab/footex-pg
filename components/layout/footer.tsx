"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site-config";
import Brand from "../brand/brand";

function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname === "/checkout") return null;

  return (
    <footer className="relative overflow-hidden bg-gradient-to-t from-blue-700 via-blue-500 to-transparent">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-10 md:py-12">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Brand */}
          <div className="flex min-h-[140px] items-center justify-center rounded-2xl border border-white/20  p-6 backdrop-blur-md">
            <Brand small />
          </div>

          {/* Contact */}
          <div className="flex min-h-[140px] flex-col justify-center rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h4>

            <div className="space-y-2 text-sm text-white/80">
              <div>{site.phone}</div>

              {site.address && (
                <div className="max-w-md leading-relaxed">
                  {site.address}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-white/20 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
            {/* Legal Links */}
            <div className="flex items-center gap-5">
              <Link
                href="/privacy-policy"
                className="text-white/70 transition-colors hover:text-white"
              >
                Privacy
              </Link>

              <span className="text-white/30">•</span>

              <Link
                href="/T&C"
                className="text-white/70 transition-colors hover:text-white"
              >
                Terms
              </Link>
            </div>

            {/* Copyright */}
            <p className="text-xs text-white/60">
              © {currentYear} {site.name.toUpperCase()}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };