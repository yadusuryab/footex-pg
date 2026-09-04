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
    <footer className="bg-muted  rounded-t-4xl ">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 grid-cols-2 md:grid-cols-4 ">
         

          {/* Links */}
          {/* <div className="flex justify-center items-center">
            <p className="text-sm text-muted-foreground">
             
              <Link 
                href="https://instagram.com/getshopigo" 
                className=" gap-1 hover:opacity-80 transition-opacity"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img 
                  src="/shopigo.avif" 
                  alt="Shopigo" 
                  className="h-10 w-auto"
                />
              </Link>
            </p>
          </div> */}
           {/* Brand */}
           <div className="flex justify-center col-span-2 items-center">
            <Brand small/>
          </div>

          {/* Support */}
          {/* <div >
            <h4 className="font-semibold mb-2 ">Support</h4>
            <div className="space-y-1 text-sm">
              <Link href="/T&C" className="block text-muted-foreground hover:text-foreground">Shipping</Link>
              <Link href="/T&C" className="block text-muted-foreground hover:text-foreground">Returns</Link>
            </div>
          </div> */}

          {/* Contact */}
          <div className="bg-background rounded-xl p-4 col-span-2 tracking-tighter">
            <h4 className="font-semibold mb-2">Contact</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>{site.phone}</div>
              {site.address && <div>{site.address}</div>}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t text-center  text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex gap-4">
              <Link href="/privacy-policy" className="hover:text-foreground">Privacy</Link>
              <Link href="/T&C" className="hover:text-foreground">Terms</Link>
            </div>
            <h4 className="text-xs">© {currentYear} {site.name.toUpperCase()}. All rights reserved.</h4 >
          
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };