"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const HIDDEN_ROUTES = ["/offer", "/checkout", "/cart", "/order"];

function getNextMidnightUTC() {
  const now = new Date();

  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0,
      0,
      0,
    ),
  );
}

function getTimeLeft(endTime: Date) {
  const now = new Date();
  const difference = endTime.getTime() - now.getTime();

  if (difference <= 0) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }

  return {
    hours: Math.floor(difference / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
    isExpired: false,
  };
}

function SaleBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const endTime = getNextMidnightUTC();

    setTimeLeft(getTimeLeft(endTime));

    const timer = setInterval(() => {
      const newTimeLeft = getTimeLeft(endTime);

      setTimeLeft(newTimeLeft);

      if (newTimeLeft.isExpired) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const stars = Array.from({ length: 14 });

  return (
    <div className="relative w-full px-3 pb-3 sm:px-4 sm:pb-4">
      {/* GOLD BORDER */}
      <div
        className="
          relative
          overflow-hidden
          rounded-xl
          border
          border-[#D4AF37]
          bg-gradient-to-r
          from-[#007cfd]
          via-[#19b8fc]
          to-secondary
          text-white
          shadow-[0_0_12px_rgba(212,175,55,0.25)]
          backdrop-blur-sm
        "
      >
        {/* Moving stars */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {stars.map((_, index) => (
            <span
              key={index}
              className="
                absolute
                bottom-[-8px]
                h-1
                w-1
                rounded-full
                bg-white
                opacity-60
                shadow-[0_0_6px_rgba(255,255,255,0.8)]
                animate-star-rise
              "
              style={{
                left: `${(index * 37) % 100}%`,
                animationDelay: `${(index * 0.45) % 5}s`,
                animationDuration: `${4 + ((index * 1.3) % 4)}s`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-between p-2 pl-3">
          {/* Text */}
          <div className="mb-3">
            <div className="text-xl font-semibold">Deal Ends In</div>

            <p className="text-xs font-semibold opacity-50">
              Don’t miss out.
            </p>
          </div>

          {/* Timer */}
          <div className="flex justify-center gap-2">
            {[
              { value: timeLeft.hours, label: "H" },
              { value: timeLeft.minutes, label: "M" },
              { value: timeLeft.seconds, label: "S" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div
                  className="
                    min-w-[50px]
                    rounded-lg
                    bg-white/20
                    p-2
                    backdrop-blur-lg
                  "
                >
                  <div className="text-lg font-bold tabular-nums">
                    {item.value.toString().padStart(2, "0")}
                  </div>

                  <div className="text-xs opacity-90">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCardWithSale() {
  const pathname = usePathname();

  const hidden = HIDDEN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (hidden) return null;

  return <SaleBanner />;
}

export { ProductCardWithSale };