"use client";

import Image from "next/image";
import { Flame } from "lucide-react";

export function FreeSocksPromo() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 shadow-lg">
      {/* diagonal ribbon */}
      <div className="absolute -left-10 top-4 rotate-[-35deg] bg-black text-yellow-300 text-xs font-bold px-10 py-1 tracking-wide">
        MEGA OFFER
      </div>

      <div className="flex flex-col sm:flex-row items-center">
        <div className="relative w-full sm:w-64 h-52 sm:h-44 shrink-0">
          <Image
            src="/promo/2.jpeg"
            alt="Free flame socks with shoes"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 p-6 text-white">
          <div className="flex items-center gap-1 text-yellow-200 text-xs font-bold uppercase mb-1">
            <Flame className="w-4 h-4" />
            Buy 1 Get 1 Shoe, Get Socks Free
          </div>
          <p className="text-2xl font-extrabold leading-tight">
            FREE FLAME SOCKS<br />ON EVERY ORDER
          </p>
          <p className="text-sm mt-1 text-white/90">
            Pan-India delivery • COD available • Ends soon
          </p>

         
        </div>
      </div>
    </div>
  );
}