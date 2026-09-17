"use client";

import { useEffect, useState, useRef } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { CustomerDetailsForm } from "@/components/checkout/checkout-form";
import { site } from "@/lib/site-config";
import { client } from "@/sanityClient";
import { fbEvent, fbTrackCustom } from "@/lib/fbq";

import { OrderSummary } from "@/components/checkout/order-summary";
import {
  BASE_PRICE,
  COD_CHARGE,
  SHOE_CLEANER_PRICE,
  ONLINE_DELIVERY_MIN_DAYS,
  ONLINE_DELIVERY_MAX_DAYS,
  COD_DELIVERY_MIN_DAYS,
  COD_DELIVERY_MAX_DAYS,
} from "@/lib/checkout-constants";
import { StepProgress } from "@/components/checkout/step-progress";
import { CartItem } from "@/lib/types/checkout";
import { CheckoutStep, CustomerDetails } from "@/lib/types/checkout";
import { getExpectedDelivery } from "@/lib/checkout-utils";
import { EmptyCart } from "@/components/checkout/empty-cart";
import { PaymentStep } from "@/components/checkout/payment-step";

const COD_ADVANCE_AMOUNT = 300;

// TODO: point this at your real site origin if site-config exposes one
// (e.g. site.url) — kept as a literal to match the domain used in the
// WhatsApp-only checkout flow.
const SITE_ORIGIN = "https://footex.in";

const REQUIRED_FIELDS = ["name", "contact1", "address", "district", "state", "pincode"] as const;

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingMethod, setShippingMethod] = useState<"online" | "cod">("online");
  const [addShoeCleaner, setAddShoeCleaner] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("payment");
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: "",
    contact1: "",
    contact2: "",
    address: "",
    district: "",
    state: "",
    pincode: "",
    landmark: "",
    instagramId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  // Reserved for operational/gateway-level messages only (script failed to
  // load, payment failed, verification failed). Required-field validation
  // is now shown inline per-field instead — see touched/getFieldError below.
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [orderDate] = useState<Date>(() => new Date());

  const [freeSocksOffer, setFreeSocksOffer] = useState(false);
  const [shoeCleanerAddon, setShoeCleanerAddon] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [razorpayReady, setRazorpayReady] = useState(false);

  // Guards so repeated step navigation doesn't re-fire InitiateCheckout.
  const initiateCheckoutFired = useRef(false);

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(Array.isArray(cart) ? cart : []);
    } catch {
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    client
      .fetch(`*[_type == "settings"][0]{ freeSocksOffer, shoeCleanerAddon }`)
      .then((data) => {
        setFreeSocksOffer(!!data?.freeSocksOffer);
        setShoeCleanerAddon(!!data?.shoeCleanerAddon);
      })
      .catch(() => {
        setFreeSocksOffer(false);
        setShoeCleanerAddon(false);
      })
      .finally(() => setSettingsLoaded(true));
  }, []);

  useEffect(() => {
    if (settingsLoaded && !shoeCleanerAddon && addShoeCleaner) {
      setAddShoeCleaner(false);
    }
  }, [settingsLoaded, shoeCleanerAddon, addShoeCleaner]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const mainProduct = cartItems[0];
  const freeProduct = mainProduct?.freeProduct;
  const pair1Extra = Math.max(0, (mainProduct?.price || BASE_PRICE) - BASE_PRICE);
  const pair2Extra = Math.max(0, (freeProduct?.price || BASE_PRICE) - BASE_PRICE);
  const subtotal = BASE_PRICE + pair1Extra + pair2Extra;
  const shippingCharge = shippingMethod === "online" ? 0 : COD_CHARGE;
  const cleanerCharge = shoeCleanerAddon && addShoeCleaner ? SHOE_CLEANER_PRICE : 0;
  const totalAmount = subtotal + shippingCharge + cleanerCharge;

  const isCod = shippingMethod === "cod";
  const paymentAmount = isCod ? COD_ADVANCE_AMOUNT : totalAmount;
  const remainingAmount = isCod ? totalAmount - COD_ADVANCE_AMOUNT : 0;

  const onlineDelivery = getExpectedDelivery(ONLINE_DELIVERY_MIN_DAYS, ONLINE_DELIVERY_MAX_DAYS, orderDate);
  const codDelivery = getExpectedDelivery(COD_DELIVERY_MIN_DAYS, COD_DELIVERY_MAX_DAYS, orderDate);
  const activeDelivery = shippingMethod === "online" ? onlineDelivery : codDelivery;

  // --- Field-level validation (inline, no top alert) ---
  const phoneValid = /^\d{10}$/.test(customerDetails.contact1.trim());
  const pincodeValid = /^\d{6}$/.test(customerDetails.pincode.trim());

  const missingFields = REQUIRED_FIELDS.filter(
    (field) => !customerDetails[field]?.trim(),
  );

  const isFormValid = missingFields.length === 0 && phoneValid && pincodeValid;

  const getFieldError = (field: string): string | undefined => {
    if (!touched[field]) return undefined;
    if (
      (REQUIRED_FIELDS as readonly string[]).includes(field) &&
      !customerDetails[field as keyof CustomerDetails]?.trim()
    ) {
      return "This field is required";
    }
    if (field === "contact1" && customerDetails.contact1.trim() && !phoneValid) {
      return "Enter a valid 10-digit phone number";
    }
    if (field === "pincode" && customerDetails.pincode.trim() && !pincodeValid) {
      return "Enter a valid 6-digit pincode";
    }
    return undefined;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const buildOrderPayload = () => {
    const items = [
      {
        productId: mainProduct?._id,
        imageUrl: mainProduct?.imageUrl,
        productName: mainProduct?.productName,
        size: mainProduct?.selectedSize,
        price: mainProduct?.price || BASE_PRICE,
        isFreeItem: false,
      },
    ];
    if (mainProduct?.buyOneGetOne && freeProduct) {
      items.push({
        productId: freeProduct._id,
        imageUrl: freeProduct.imageUrl,
        productName: freeProduct.productName,
        size: freeProduct.selectedSize,
        price: freeProduct.price || BASE_PRICE,
        isFreeItem: true,
      });
    }
    return {
      items,
      customerDetails,
      shippingMethod,
      shoeCleanerAddon: shoeCleanerAddon && addShoeCleaner,
      freeSocksOffer,
      subtotal,
      shippingCharge,
      totalAmount,
      isCod,
      advancePaid: paymentAmount,
      remainingAmount,
      expectedDeliveryLabel: activeDelivery.label,
    };
  };

  // Shared shape for Meta Pixel content params, built from cart contents.
  const buildPixelPayload = () => {
    const ids = [mainProduct?._id].filter(Boolean) as string[];
    if (mainProduct?.buyOneGetOne && freeProduct?._id) ids.push(freeProduct._id);
    return {
      content_ids: ids,
      content_type: "product" as const,
      contents: ids.map((id) => ({ id, quantity: 1 })),
      num_items: ids.length,
      currency: "INR",
    };
  };

  // Builds the same order-confirmation message format used by the
  // WhatsApp-only checkout flow, so support gets a consistent layout
  // regardless of which path the order came through.
  const buildWhatsAppMessage = (reason: string) => {
    const pairLines = [
      `*PAIR 1 :* ${SITE_ORIGIN}/p/${mainProduct?._id}\nSize: ${mainProduct?.selectedSize || "N/A"}`,
    ];
    if (mainProduct?.buyOneGetOne && freeProduct) {
      pairLines.push(
        `*PAIR 2 :* ${SITE_ORIGIN}/p/${freeProduct._id}\nSize: ${freeProduct.selectedSize || "N/A"}`,
      );
    }

    return `*ORDER CONFIRMATION – 2 PAIR COMBO*
⚠️ ${reason}. Please confirm this order manually.

*CUSTOMER INFORMATION*
Name: ${customerDetails.name}
Instagram ID: ${customerDetails.instagramId || "N/A"}
Address: ${customerDetails.address}
District: ${customerDetails.district}
State: ${customerDetails.state}
Pincode: ${customerDetails.pincode}
Landmark: ${customerDetails.landmark || "N/A"}
Phone 1: ${customerDetails.contact1}
Alternative Phone 2: ${customerDetails.contact2 || "N/A"}

*PRODUCT DETAILS*

${pairLines.join("\n\n")}

*PAYMENT SUMMARY*
- Product Price: ₹${subtotal}
${cleanerCharge > 0 ? `- Add-on: Shoe Cleaner (+₹${SHOE_CLEANER_PRICE})\n` : ""}- Shipping: ${shippingMethod === "online" ? "Free (Prepaid)" : `₹${COD_CHARGE} (COD)`}
${isCod ? `- Advance attempted: ₹${COD_ADVANCE_AMOUNT}\n` : ""}
*Total Amount Payable: ₹${totalAmount}✅*`.trim();
  };

  // Single fallback path for any payment-gateway failure: build the order
  // message, hand it to WhatsApp, and clear the cart since the order has
  // effectively been handed off for manual confirmation.
  const redirectToWhatsAppFallback = (reason: string) => {
    // Order wasn't confirmed by Razorpay, so this is a custom event, not
    // a standard Purchase — keeps reported Purchase revenue accurate.
    fbTrackCustom("WhatsAppOrderHandoff", {
      value: totalAmount,
      currency: "INR",
      reason,
    });

    const message = buildWhatsAppMessage(reason);
    window.open(`https://wa.me/${site.phone}?text=${encodeURIComponent(message)}`, "_blank");
    localStorage.removeItem("cart");
    setFormErrors([`${reason}. We've opened WhatsApp so you can confirm your order directly with us.`]);
    setIsLoading(false);
  };

  const goToDetailsStep = () => {
    if (!initiateCheckoutFired.current) {
      initiateCheckoutFired.current = true;
      fbEvent("InitiateCheckout", {
        ...buildPixelPayload(),
        value: totalAmount,
      });
    }
    setCurrentStep("details");
  };

  const handleRazorpayPayment = async () => {
    // Mark every required field touched so any that are still invalid
    // surface their inline error right under the field, instead of a
    // separate list at the top of the page.
    setTouched((prev) => {
      const next = { ...prev };
      REQUIRED_FIELDS.forEach((field) => {
        next[field] = true;
      });
      return next;
    });

    if (!isFormValid) {
      return;
    }

    if (!razorpayReady || typeof window.Razorpay === "undefined") {
      redirectToWhatsAppFallback("Payment gateway is currently unavailable");
      return;
    }

    setIsLoading(true);
    setFormErrors([]);

    try {
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: paymentAmount,
          currency: "INR",
          receipt: `order_${Date.now()}`,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData?.order?.id) {
        throw new Error(orderData?.error || "Could not create order");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: site.name || "Footex",
        description: isCod
          ? `COD Advance Payment (₹${COD_ADVANCE_AMOUNT})`
          : "2 Pair Shoes Order",
        order_id: orderData.order.id,
        prefill: {
          name: customerDetails.name,
          contact: customerDetails.contact1,
        },
        notes: {
          address: customerDetails.address,
          district: customerDetails.district,
          state: customerDetails.state,
          pincode: customerDetails.pincode,
          instagram: customerDetails.instagramId,
          isCod: String(isCod),
          remainingAmount: String(remainingAmount),
        },
        theme: { color: "#000000" },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderPayload: buildOrderPayload(),
              }),
            });
            const verifyData = await verifyRes.json();

            if (!verifyData.success) {
              redirectToWhatsAppFallback("Payment verification failed");
              return;
            }

            // Fire only after server-side verification succeeds, and use
            // the Razorpay payment id as the eventID so a page refresh on
            // /order-confirmed can't double-count this purchase (dedupe
            // also applies if you later add server-side Conversions API).
            fbEvent(
              "Purchase",
              {
                ...buildPixelPayload(),
                value: totalAmount,
                content_name: isCod ? "COD Order" : "Prepaid Order",
              },
              response.razorpay_payment_id,
            );

            localStorage.removeItem("cart");
            router.push(`/order-confirmed?payment_id=${response.razorpay_payment_id}`);
          } catch {
            redirectToWhatsAppFallback("We couldn't confirm your payment");
          }
        },
        modal: {
          // User closed the checkout modal themselves — that's a
          // cancellation, not a gateway failure, so just reset state
          // rather than redirecting them elsewhere.
          ondismiss: () => setIsLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        redirectToWhatsAppFallback("Your payment failed");
      });
      rzp.open();
    } catch (err) {
      redirectToWhatsAppFallback("We couldn't start the payment");
    }
  };

  if (!cartItems.length || !mainProduct) {
    return <EmptyCart isInvalid={cartItems.length > 0} />;
  }

  return (
    <main className="container mx-auto px-4 max-w-2xl min-h-screen pb-24">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayReady(true)}
        onError={() => setRazorpayReady(false)}
      />

      <div className="py-4">
        <StepProgress currentStep={currentStep} />

        {formErrors.length > 0 && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {formErrors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {currentStep === "payment" ? (
          <PaymentStep
            mainProduct={mainProduct}
            freeProduct={freeProduct}
            freeSocksOffer={freeSocksOffer}
            shoeCleanerAddon={shoeCleanerAddon}
            addShoeCleaner={addShoeCleaner}
            setAddShoeCleaner={setAddShoeCleaner}
            shippingMethod={shippingMethod}
            setShippingMethod={setShippingMethod}
            onlineDeliveryLabel={onlineDelivery.label}
            codDeliveryLabel={codDelivery.label}
            onContinue={goToDetailsStep}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" /> Delivery Information
              </CardTitle>
              <CardDescription>Enter your details for order delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerDetailsForm
                customerDetails={customerDetails}
                handleInputChange={handleInputChange}
                handleInputBlur={handleInputBlur}
                getFieldError={getFieldError}
              />
            </CardContent>
          </Card>
        )}

        <OrderSummary
          pair1Extra={pair1Extra}
          pair2Extra={pair2Extra}
          freeSocksOffer={freeSocksOffer}
          shoeCleanerAddon={shoeCleanerAddon}
          addShoeCleaner={addShoeCleaner}
          shippingMethod={shippingMethod}
          activeDeliveryEnd={activeDelivery.end}
          totalAmount={totalAmount}
        />

        {isCod && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            ₹{COD_ADVANCE_AMOUNT} advance now, ₹{remainingAmount} on delivery.
          </p>
        )}
      </div>

      {freeSocksOffer && (
        <div className="fixed bottom-24 right-4 z-40 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 text-white text-xs font-bold px-3 py-2 shadow-lg ring-2 ring-yellow-300 animate-bounce">
          Free Socks 🎉
        </div>
      )}

      {currentStep === "details" && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t p-4">
          <div className="container mx-auto px-4 max-w-2xl">
            <Button
              onClick={handleRazorpayPayment}
              disabled={isLoading}
              className="w-full h-12 text-lg font-semibold flex items-center gap-2"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Processing...
                </>
              ) : isCod ? (
                `Pay ₹${COD_ADVANCE_AMOUNT} Advance`
              ) : (
                `Pay Now – ₹${totalAmount}`
              )}
            </Button>
            {!isFormValid && (
              <p className="text-xs text-center text-red-500 mt-2">
                Fill all required fields to continue
              </p>
            )}
            <p className="text-xs text-center text-muted-foreground mt-2">
              Secure payment via Razorpay • Estimated delivery {activeDelivery.label}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}