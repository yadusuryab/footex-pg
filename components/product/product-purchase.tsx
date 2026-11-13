"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { PhoneCall, ShoppingBag, Ruler, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ONE_PAIR_PRICE } from "@/lib/checkout-constants";

interface Props {
  product: any;
  imageUrl?: string;
  phone?: string;
}

type System = "UK" |"EU";
const SYSTEMS: System[] = ["UK", "EU"];

// Product sizes are stored as UK. Edit this map to match your size chart.
const SIZE_MAP: Record<string, { US: string; EU: string }> = {
  "3": { US: "4", EU: "36" },
  "4": { US: "5", EU: "37" },
  "5": { US: "6", EU: "38" },
  "6": { US: "7", EU: "40" },
  "7": { US: "8", EU: "41" },
  "8": { US: "9", EU: "42" },
  "9": { US: "10", EU: "43" },
  "10": { US: "11", EU: "44" },
  "11": { US: "12", EU: "45" },
  "12": { US: "13", EU: "46" },
};

const convert = (uk: string, system: System) => {
  if (system === "UK") return uk;
  return SIZE_MAP[uk]?.[system] ?? uk; // fallback: show UK value
};

export default function ProductPurchase({ product, imageUrl, phone }: Props) {
  const router = useRouter();
  const sizeRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<string | null>(null); // always UK internally
  const [system, setSystem] = useState<System>("UK");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const price =
    product.isOffer && product.offerPrice ? product.offerPrice : product.price;

  const isDisabled = (s: string | number) =>
    !!product.disabledSizes?.some((d: any) => String(d) === String(s));

  const buyNow = () => {
    if (loading) return;

    if (!size) {
      setError(true);
      sizeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      toast.error("Please select a size");
      return;
    }

    setLoading(true);

    const cartItem = {
      ...product,
      imageUrl:
        typeof product.imageUrl === "string" ? product.imageUrl : imageUrl,
      selectedSize: size, // UK (canonical)
      selectedSizeLabel: `UK ${size} / EU ${convert(size, "EU")}`,
      offerType: "one-pair",
      freeProduct: null,
    };

    try {
      localStorage.setItem("cart", JSON.stringify([cartItem]));
      window.dispatchEvent(new Event("cartUpdated"));
      router.push("/checkout");
    } catch {
      setLoading(false);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <>
      <div className="space-y-5">
        {/* Size selector */}
        <div ref={sizeRef} className="scroll-mt-24 bg-muted px-4 py-4 rounded-2xl">
          <div className="flex items-center justify-between mb-3 gap-2">
            <p className="text-sm font-semibold flex items-center gap-1.5">
              <Ruler className="h-4 w-4" /> Select Size
            </p>

            {/* UK / US / EU switch */}
            <div className="inline-flex rounded-lg bg-background p-0.5 border">
              {SYSTEMS.map((sys) => (
                <button
                  key={sys}
                  type="button"
                  onClick={() => setSystem(sys)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    system === sys
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {sys}
                </button>
              ))}
            </div>
          </div>

          <div className="h-4 mb-2">
            {size ? (
              <span className="text-xs text-muted-foreground">
                Selected: {system} {convert(size, system)}
                {system !== "UK" && ` (UK ${size})`}
              </span>
            ) : error ? (
              <span className="text-xs font-medium text-destructive">
                Please choose a size
              </span>
            ) : null}
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {product.sizes?.map((raw: string | number) => {
              const uk = String(raw);
              const off = isDisabled(uk);
              const active = size === uk;
              return (
                <button
                  key={uk}
                  type="button"
                  disabled={off}
                  onClick={() => {
                    setSize(uk);
                    setError(false);
                  }}
                  className={`h-11 rounded-lg border text-sm font-semibold transition-all active:scale-95
                    ${
                      active
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background hover:border-primary"
                    }
                    ${error && !active && !off ? "border-destructive/60" : ""}
                    ${
                      off
                        ? "line-through opacity-40 cursor-not-allowed hover:border-border active:scale-100"
                        : ""
                    }`}
                >
                  {convert(uk, system)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop actions */}
        <div className="hidden md:grid grid-cols-[auto_1fr] gap-3">
          {phone && (
            <Link href={`tel:${phone}`} prefetch={false}>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-4"
                aria-label="Call"
              >
                <PhoneCall className="h-4 w-4" />
              </Button>
            </Link>
          )}
          <Button
            size="lg"
            onClick={buyNow}
            disabled={loading}
            className="h-12 rounded-xl text-base font-semibold col-start-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Buy Now
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-3">
          {phone && (
            <Link href={`tel:${phone}`} prefetch={false}>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-4"
                aria-label="Call"
              >
                <PhoneCall className="h-4 w-4" />
              </Button>
            </Link>
          )}
          <Button
            size="lg"
            onClick={buyNow}
            disabled={loading}
            className="flex-1 h-12 rounded-xl text-base font-semibold justify-between px-5"
          >
            <span className="flex items-center gap-2">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShoppingBag className="h-4 w-4" />
              )}
              {loading ? "Please wait" : "Buy Now"}
            </span>
            <span>₹{ONE_PAIR_PRICE?.toLocaleString("en-IN")}</span>
          </Button>
        </div>
      </div>
    </>
  );
}