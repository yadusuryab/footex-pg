import { Truck, Flame, SprayCan } from "lucide-react";
import Link from "next/link";
import { formatDeliveryDate } from "@/lib/checkout-utils";
import {
  BASE_PRICE,
  COD_CHARGE,
  SHOE_CLEANER_PRICE,
  ONLINE_DELIVERY_MIN_DAYS,
  ONLINE_DELIVERY_MAX_DAYS,
  COD_DELIVERY_MIN_DAYS,
  COD_DELIVERY_MAX_DAYS,
} from "@/lib/checkout-constants";

export function OrderSummary({
  pair1Extra,
  pair2Extra,
  freeSocksOffer,
  shoeCleanerAddon,
  addShoeCleaner,
  shippingMethod,
  activeDeliveryEnd,
  totalAmount,
}: {
  pair1Extra: number;
  pair2Extra: number;
  freeSocksOffer: boolean;
  shoeCleanerAddon: boolean;
  addShoeCleaner: boolean;
  shippingMethod: "online" | "cod";
  activeDeliveryEnd: Date;
  totalAmount: number;
}) {
  return (
    <div className="mt-6 rounded-2xl bg-muted/40 p-5">
      <div className="space-y-2.5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Base price (2 pairs)</span>
          <span>₹{BASE_PRICE}</span>
        </div>
        {pair1Extra > 0 && (
          <div className="flex justify-between text-xs text-muted-foreground pl-3">
            <span>Extra — Pair 1</span>
            <span>+₹{pair1Extra}</span>
          </div>
        )}
        {pair2Extra > 0 && (
          <div className="flex justify-between text-xs text-muted-foreground pl-3">
            <span>Extra — Pair 2</span>
            <span>+₹{pair2Extra}</span>
          </div>
        )}
        {freeSocksOffer && (
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Flame className="h-3.5 w-3.5" /> Flame socks
            </span>
            <span className="font-medium">Free</span>
          </div>
        )}
        {shoeCleanerAddon && addShoeCleaner && (
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <SprayCan className="h-3.5 w-3.5" /> Shoe cleaner
            </span>
            <span>+₹{SHOE_CLEANER_PRICE}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          {shippingMethod === "online" ? (
            <span className="font-medium">Free</span>
          ) : (
            <span>₹{COD_CHARGE}</span>
          )}
        </div>

        <div className="rounded-xl bg-background p-4 flex items-center gap-3 mt-1">
          <Truck className="h-5 w-5 text-muted-foreground shrink-0" strokeWidth={1.75} />
          <div>
            <p className="text-xs font-medium text-foreground">
              Arrives by {formatDeliveryDate(activeDeliveryEnd)}
            </p>
            <p className="text-xs text-muted-foreground">
              {shippingMethod === "online"
                ? `${ONLINE_DELIVERY_MIN_DAYS}–${ONLINE_DELIVERY_MAX_DAYS}`
                : `${COD_DELIVERY_MIN_DAYS}–${COD_DELIVERY_MAX_DAYS}`}{" "}
              working days
            </p>
          </div>
        </div>

        <div className="border-t border-border/60 pt-3 flex justify-between font-semibold text-base">
          <span>Total</span>
          <span>₹{totalAmount}</span>
        </div>

        {shippingMethod === "cod" && (
          <p className="text-xs text-muted-foreground text-center">
            Switch to prepaid to save ₹{COD_CHARGE}
          </p>
        )}

        <div className="border-t border-border/60 pt-3 text-xs text-muted-foreground">
          By placing this order, you agree to the{" "}
          <Link href="/T&C" className="text-foreground underline underline-hover">
            Terms and Conditions
          </Link>
        </div>
      </div>
    </div>
  );
}