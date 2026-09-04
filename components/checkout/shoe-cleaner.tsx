import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Star, SprayCan } from "lucide-react";
import { SHOE_CLEANER_PRICE } from "@/lib/checkout-constants";

export function ShoeCleanerAddon({
  addShoeCleaner,
  setAddShoeCleaner,
}: {
  addShoeCleaner: boolean;
  setAddShoeCleaner: (v: boolean) => void;
}) {
  return (
    <div
      onClick={() => setAddShoeCleaner(!addShoeCleaner)}
      className={`relative mt-4 cursor-pointer rounded-xl p-[2px] transition-all ${
        addShoeCleaner
          ? "bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500"
          : "bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 animate-pulse"
      }`}
    >
      <div className="absolute -top-2.5 left-4 z-10 flex items-center gap-1 rounded-full bg-yellow-400 px-2.5 py-0.5 shadow-md">
        <Star className="h-3 w-3 text-yellow-900 fill-yellow-900" />
        <span className="text-[10px] font-extrabold text-yellow-900 tracking-wide">
          LIMITED OFFER
        </span>
      </div>

      <div
        className={`flex items-start gap-3 rounded-[10px] p-4 pt-5 ${addShoeCleaner ? "bg-blue-50" : "bg-white"}`}
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${addShoeCleaner ? "bg-blue-600" : "bg-gradient-to-br from-purple-600 to-cyan-500"}`}
        >
          <SprayCan className="h-5 w-5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Label className="font-bold cursor-pointer text-sm">
              Add Premium Shoe Cleaner
            </Label>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground line-through">
                ₹199
              </span>
              <Badge className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                ₹{SHOE_CLEANER_PRICE} only
              </Badge>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Keep both pairs looking fresh · Most customers add this 🔥
          </p>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={addShoeCleaner}
              onChange={() => setAddShoeCleaner(!addShoeCleaner)}
              className="h-4 w-4 accent-blue-600"
            />
            <span
              className={`text-xs font-semibold ${addShoeCleaner ? "text-blue-600" : "text-muted-foreground"}`}
            >
              {addShoeCleaner ? "✓ Added to your order" : "Tap to add"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}