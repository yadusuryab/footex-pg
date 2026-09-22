import React from "react";
import { Check } from "lucide-react";
import { CheckoutStep } from "@/lib/types/checkout";

const STEPS: { key: CheckoutStep; label: string }[] = [
  { key: "payment", label: "Order Summary" },
  { key: "details", label: "Delivery Details" },
];

export function StepProgress({ currentStep }: { currentStep: CheckoutStep }) {
  const activeIdx = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="w-full max-w-md mx-auto mb-8 px-2">
      <div className="relative flex items-center justify-between">
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-muted -z-0">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{
              width: activeIdx === 0 ? "0%" : "100%",
            }}
          />
        </div>

        {STEPS.map((step, i) => {
          const isDone = activeIdx > i;
          const isActive = activeIdx === i;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-300 ${
                  isDone
                    ? "bg-primary border-primary text-primary-foreground"
                    : isActive
                    ? "bg-background border-primary text-primary ring-4 ring-primary/15"
                    : "bg-background border-muted text-muted-foreground"
                }`}
              >
                {isDone ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`text-[11px] font-medium whitespace-nowrap transition-colors ${
                  isActive || isDone ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}