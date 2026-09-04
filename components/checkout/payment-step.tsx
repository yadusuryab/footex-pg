import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Zap, Truck, ArrowRight, Flame } from "lucide-react";
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Select Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Product Pairs */}
        <div className="mb-6">
          <Label className="text-sm font-medium mb-3 block">
            Your Selected Pairs 🔥
          </Label>
          <div className="flex gap-4">
            <div className="flex-1">
              <ProductImage
                product={mainProduct}
                alt={mainProduct.productName || "Main Product"}
                borderClass="border-blue-500"
              />
              <div className="mt-2 text-center">
                <p className="text-sm font-medium">
                  {mainProduct.productName || "Product"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Size: {mainProduct.selectedSize || "N/A"}
                </p>
                <Badge variant="default" className="mt-1">
                  1st Pair
                </Badge>
              </div>
            </div>
            {freeProduct && (
              <div className="flex-1">
                <ProductImage
                  product={freeProduct}
                  alt={freeProduct.productName || "Free Product"}
                  borderClass="border-green-500"
                />
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium">
                    {freeProduct.productName || "Free Product"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Size: {freeProduct.selectedSize || "N/A"}
                  </p>
                  <Badge className="mt-1 bg-green-600 text-white">
                    2nd Pair
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {freeSocksOffer && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 px-3 py-2 shadow-sm">
              <Flame className="h-4 w-4 text-white shrink-0" />
              <p className="text-xs font-bold text-white">
                Offer: Free Flame Socks with this order 🎉
              </p>
            </div>
          )}
        </div>

        {/* Payment Options */}
        <RadioGroup
          value={shippingMethod}
          onValueChange={(v: "online" | "cod") => setShippingMethod(v)}
          className="space-y-3"
        >
          <div
            className={`flex items-start gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all ${
              shippingMethod === "online"
                ? "border-red-500 bg-red-50"
                : "border-muted hover:border-primary/50"
            }`}
            onClick={() => setShippingMethod("online")}
          >
            <RadioGroupItem value="online" id="online" className="mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <Label htmlFor="online" className="font-semibold cursor-pointer">
                  Online Payment
                </Label>
                <Badge className="bg-green-700 text-green-50 text-xs px-2 py-0.5 rounded-full">
                  Free shipping
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                  <Zap className="h-3 w-3" /> Save ₹{COD_CHARGE} instantly
                </span>
                <span className="flex items-center gap-1 text-xs text-blue-600">
                  <Truck className="h-3 w-3" /> Arrives {onlineDeliveryLabel}
                </span>
              </div>
            </div>
          </div>

          <div
            className={`flex items-start gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all ${
              shippingMethod === "cod"
                ? "border-orange-400 bg-orange-50"
                : "border-muted hover:border-primary/50"
            }`}
            onClick={() => setShippingMethod("cod")}
          >
            <RadioGroupItem value="cod" id="cod" className="mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <Label htmlFor="cod" className="font-semibold cursor-pointer">
                  Cash on Delivery
                </Label>
                <Badge className="text-orange-800 border-orange-200 bg-orange-100 text-xs px-2 py-0.5 rounded-full">
                  +₹{COD_CHARGE} extra
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Pay when you receive · Arrives {codDeliveryLabel}
              </p>
            </div>
          </div>
        </RadioGroup>

        {shoeCleanerAddon && (
          <ShoeCleanerAddon
            addShoeCleaner={addShoeCleaner}
            setAddShoeCleaner={setAddShoeCleaner}
          />
        )}

        <Button
          onClick={onContinue}
          className="w-full h-12 text-lg font-semibold mt-6 flex items-center gap-2"
          size="lg"
        >
          Continue to Details <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}