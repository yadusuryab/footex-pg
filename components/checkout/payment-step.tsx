import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Sparkles, Check } from "lucide-react";
import { ProductImage } from "./product-image";
import { CartItem } from "@/lib/types/checkout";
import { COD_CHARGE } from "@/lib/checkout-constants";
import { ShoeCleanerAddon } from "./shoe-cleaner";

export function PaymentStep({
  mainProduct,
  freeProduct,
  freeSocksOffer,
  shoeCleanerAddon,
  addShoeCleaner,
  setAddShoeCleaner,
  shippingMethod,
  setShippingMethod,
  onlineDeliveryLabel,
  codDeliveryLabel,
  onContinue,
}: {
  mainProduct: CartItem;
  freeProduct?: CartItem;
  freeSocksOffer: boolean;
  shoeCleanerAddon: boolean;
  addShoeCleaner: boolean;
  setAddShoeCleaner: (v: boolean) => void;
  shippingMethod: "online" | "cod";
  setShippingMethod: (v: "online" | "cod") => void;
  onlineDeliveryLabel: string;
  codDeliveryLabel: string;
  onContinue: () => void;
}) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0 space-y-7">
        {/* Product Pairs */}
        <div>
          <div className="grid grid-cols-2 gap-3">
            <div className="group relative rounded-2xl bg-muted/40 p-3 transition-colors">
              <ProductImage
                product={mainProduct}
                alt={mainProduct.productName || "Main Product"}
                borderClass="border-transparent"
              />
              <div className="mt-2.5">
                <p className="text-sm font-medium leading-tight truncate text-foreground">
                  {mainProduct.productName || "Product"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Size {mainProduct.selectedSize || "N/A"}
                </p>
              </div>
              <span className="absolute top-2 left-2 text-[10px] font-medium bg-background/90 backdrop-blur px-2 py-0.5 rounded-full text-foreground/70">
                Pair 1
              </span>
            </div>

            {freeProduct && (
              <div className="group relative rounded-2xl bg-muted/40 p-3 transition-colors">
                <ProductImage
                  product={freeProduct}
                  alt={freeProduct.productName || "Free Product"}
                  borderClass="border-transparent"
                />
                <div className="mt-2.5">
                  <p className="text-sm font-medium leading-tight truncate text-foreground">
                    {freeProduct.productName || "Free Product"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Size {freeProduct.selectedSize || "N/A"}
                  </p>
                </div>
                <span className="absolute top-2 left-2 text-[10px] font-medium bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                  Free
                </span>
              </div>
            )}
          </div>

          {freeSocksOffer && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-foreground text-background px-3.5 py-2.5">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <p className="text-xs font-medium">
                Free socks included with this order
              </p>
            </div>
          )}
        </div>

        {/* Payment Options */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2.5">
            Payment method
          </p>
          <RadioGroup
            value={shippingMethod}
            onValueChange={(v: "online" | "cod") => setShippingMethod(v)}
            className="space-y-2"
          >
            <label
              htmlFor="online"
              className={`relative flex items-center gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${
                shippingMethod === "online"
                  ? "border-foreground bg-foreground/[0.03]"
                  : "border-border hover:border-foreground/30"
              }`}
            >
              <div
                className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border transition-all ${
                  shippingMethod === "online"
                    ? "border-foreground bg-foreground"
                    : "border-muted-foreground/40"
                }`}
              >
                {shippingMethod === "online" && (
                  <Check className="h-3 w-3 text-background" strokeWidth={3} />
                )}
              </div>
              <RadioGroupItem value="online" id="online" className="sr-only" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">Prepaid</span>
                  <span className="text-xs font-medium text-emerald-600">
                    Free shipping
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Truck className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Arrives {onlineDeliveryLabel}
                  </span>
                </div>
              </div>
            </label>

            <label
              htmlFor="cod"
              className={`relative flex items-center gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${
                shippingMethod === "cod"
                  ? "border-foreground bg-foreground/[0.03]"
                  : "border-border hover:border-foreground/30"
              }`}
            >
              <div
                className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border transition-all ${
                  shippingMethod === "cod"
                    ? "border-foreground bg-foreground"
                    : "border-muted-foreground/40"
                }`}
              >
                {shippingMethod === "cod" && (
                  <Check className="h-3 w-3 text-background" strokeWidth={3} />
                )}
              </div>
              <RadioGroupItem value="cod" id="cod" className="sr-only" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">Cash on delivery</span>
                  <span className="text-xs font-medium text-muted-foreground">
                    +₹{COD_CHARGE}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Arrives {codDeliveryLabel}
                </p>
              </div>
            </label>
          </RadioGroup>
        </div>

        {shoeCleanerAddon && (
          <ShoeCleanerAddon
            addShoeCleaner={addShoeCleaner}
            setAddShoeCleaner={setAddShoeCleaner}
          />
        )}

        <Button
          onClick={onContinue}
          className="w-full h-12 text-sm font-medium rounded-md flex items-center gap-2"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}