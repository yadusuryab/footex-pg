// components/sections/shop-video.tsx
"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX, CheckCircle, Shield, Star } from "lucide-react";

export function ShopVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  return (
    <section className="flex flex-col items-center py-12 px-4">
      <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-[2rem] overflow-hidden shadow-2xl bg-black ring-1 ring-black/10">
        <video
          ref={videoRef}
          src="/v2.mov"
          autoPlay
          loop
          muted={muted}
          playsInline
          className="h-full w-full object-cover"
        />

        {/* Trust Badge - Top Left */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1.5 text-white text-xs font-medium">
          <Shield className="h-3.5 w-3.5" />
          <span>Verified</span>
        </div>

        {/* Trust Badge - Top Right */}
        <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-amber-500/90 backdrop-blur-sm px-3 py-1.5 text-white text-xs font-medium">
          <Star className="h-3.5 w-3.5 fill-white" />
          <span>4.9 ★</span>
        </div>

        {/* About Overlay - Bottom */}
        <div className="absolute bottom-16 left-0 right-0 px-4">
          <div className="rounded-xl bg-black/60 backdrop-blur-sm p-3 text-white">
            <p className="text-xs font-medium leading-relaxed opacity-90">
              Premium quality • Sustainable materials • All india delivery
            </p>
            <div className="mt-1.5 flex items-center gap-3 text-[10px] text-white/70">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Ethically made
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Free shipping
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={toggleMute}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      </div>

      {/* Additional Trust Section Below Video */}
    
    </section>
  );
}