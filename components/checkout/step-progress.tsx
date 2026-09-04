import React from "react";
import { CheckCircle2 } from "lucide-react";
import { CheckoutStep } from "@/lib/types/checkout";

export function StepProgress({ currentStep }: { currentStep: CheckoutStep }) {
  return (
    <div className="flex items-center justify-center mb-6">
      {(["payment", "details"] as CheckoutStep[]).map((step, i) => {
        const labels = ["Payment", "Details"];
        const activeIdx = ["payment", "details"].indexOf(currentStep);
        const isDone = activeIdx > i;
        const isActive = currentStep === step;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${isActive ? "bg-primary text-primary-foreground" : isDone ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"}`}
              >
                {isDone ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className="text-xs mt-1">{labels[i]}</span>
            </div>
            {i < 1 && (
              <div
                className={`w-12 h-1 mx-1 transition-colors ${isDone || isActive ? "bg-green-500" : "bg-muted"}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}