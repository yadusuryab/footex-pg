import { SprayCan, Check } from "lucide-react";
import { SHOE_CLEANER_PRICE } from "@/lib/checkout-constants";

export function ShoeCleanerAddon({
  addShoeCleaner,
  setAddShoeCleaner,
}: {
  addShoeCleaner: boolean;
  setAddShoeCleaner: (v: boolean) => void;
}) {
  return (
    <label
      onClick={() => setAddShoeCleaner(!addShoeCleaner)}
      className={`flex items-center gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${
        addShoeCleaner
          ? "border-foreground bg-foreground/[0.03]"
          : "border-border hover:border-foreground/30"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          addShoeCleaner ? "bg-foreground" : "bg-muted"
        }`}
      >
        <SprayCan
          className={`h-4 w-4 ${addShoeCleaner ? "text-background" : "text-muted-foreground"}`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">Shoe cleaner add-on</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground line-through">
              ₹199
            </span>
            <span className="text-xs font-medium">
              ₹{SHOE_CLEANER_PRICE}
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Keep both pairs looking fresh
        </p>
      </div>

      <div
        className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border transition-all ${
          addShoeCleaner
            ? "border-foreground bg-foreground"
            : "border-muted-foreground/40"
        }`}
      >
        {addShoeCleaner && (
          <Check className="h-3 w-3 text-background" strokeWidth={3} />
        )}
      </div>
    </label>
  );
}