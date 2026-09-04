"use client";
import { useState, useEffect } from "react";

function getNextMidnightUTC() {
  const now = new Date();
  const nextMidnight = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0, 0, 0
    )
  );
  return nextMidnight;
}

function getTimeLeft(endTime: Date) {
  const now = new Date();
  const difference = endTime.getTime() - now.getTime();

  if (difference <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, isExpired: false };
}

function ProductCardWithSale() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, isExpired: false });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const endTime = getNextMidnightUTC();
    setTimeLeft(getTimeLeft(endTime));

    const timer = setInterval(() => {
      const newTimeLeft = getTimeLeft(endTime);
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft.isExpired) {
        setIsVisible(false);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className={`rounded-xl p-4 ${
         'bg-secondary text-secondary-foreground'
      }`}>
        <div className="text-center mb-3">
          <div className="text-sm font-semibold">Deal Ends In</div>
        </div>
        
        <div className="flex justify-center gap-2">
          {[
            { value: timeLeft.hours, label: 'H' },
            { value: timeLeft.minutes, label: 'M' },
            { value: timeLeft.seconds, label: 'S' }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="bg-white/20 rounded-lg p-2 min-w-[50px]">
                <div className="text-lg font-bold tabular-nums">
                  {item.value.toString().padStart(2, '0')}
                </div>
                <div className="text-xs opacity-90">{item.label}</div>
              </div>
            </div>
          ))}
        </div>

      
      </div>
    </div>
  );
}

export { ProductCardWithSale };