"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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
import { CartItem, CheckoutStep, CustomerDetails } from "@/lib/types/checkout";
import { getExpectedDelivery } from "@/lib/checkout-utils";
import { EmptyCart } from "@/components/checkout/empty-cart";
import { PaymentStep } from "@/components/checkout/payment-step";

const COD_ADVANCE_AMOUNT = 300;
const RAZORPAY_SRC = "https://checkout.razorpay.com/v1/checkout.js";

const REQUIRED_FIELDS = [
  "name",
  "contact1",
  "address",
  "district",
  "state",
  "pincode",
] as const;

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpay = (): Promise<boolean> =>
  new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SRC}"]`,
    );
    if (existing) existing.remove();

    const timeout = setTimeout(() => resolve(false), 8000);
    const s = document.createElement("script");
    s.src = RAZORPAY_SRC;
    s.async = true;
    s.onload = () => {
      clearTimeout(timeout);
      resolve(!!window.Razorpay);
    };
    s.onerror = () => {
      clearTimeout(timeout);
      resolve(false);
    };
    document.body.appendChild(s);
  });

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
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [orderDate] = useState<Date>(() => new Date());

  const [freeSocksOffer, setFreeSocksOffer] = useState(false);
  const [shoeCleanerAddon, setShoeCleanerAddon] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    loadRazorpay();
  }, []);

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

  const onlineDelivery = getExpectedDelivery(
    ONLINE_DELIVERY_MIN_DAYS,
    ONLINE_DELIVERY_MAX_DAYS,
    orderDate,
  );
  const codDelivery = getExpectedDelivery(
    COD_DELIVERY_MIN_DAYS,
    COD_DELIVERY_MAX_DAYS,
    orderDate,
  );
  const activeDelivery = shippingMethod === "online" ? onlineDelivery : codDelivery;

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

  // Build the minimal cart payload the server needs.
  // Prices are intentionally NOT sent — the server recomputes them.
  const buildCartPayload = () => {
    const items = [
      {
        productId: mainProduct?._id,
        size: mainProduct?.selectedSize,
        isFreeItem: false,
      },
    ];
    if (mainProduct?.buyOneGetOne && freeProduct) {
      items.push({
        productId: freeProduct._id,
        size: freeProduct.selectedSize,
        isFreeItem: true,
      });
    }
    return items;
  };

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

  const goToDetailsStep = () => setCurrentStep("details");

  const handleRazorpayPayment = async () => {
    setTouched((prev) => {
      const next = { ...prev };
      REQUIRED_FIELDS.forEach((field) => {
        next[field] = true;
      });
      return next;
    });

    if (!isFormValid) return;

    setIsLoading(true);
    setFormErrors([]);

    const loaded = await loadRazorpay();
    if (!loaded) {
      setFormErrors(["Payment gateway is currently unavailable. Please try again."]);
      setIsLoading(false);
      return;
    }

    try {
      // 1) Server creates the Sanity order + Razorpay order in one go.
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: buildCartPayload(),
          customerDetails,
          shippingMethod,
          shoeCleanerAddon: shoeCleanerAddon && addShoeCleaner,
          freeSocksOffer,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData?.razorpayOrder?.id) {
        throw new Error(orderData?.error || "Could not create order");
      }

      const { razorpayOrder, keyId, orderId } = orderData;

      const options = {
        key: keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: site.name || "Footex",
        description: isCod
          ? `COD Advance Payment (₹${COD_ADVANCE_AMOUNT})`
          : "2 Pair Shoes Order",
        order_id: razorpayOrder.id,
        prefill: {
          name: customerDetails.name,
          contact: customerDetails.contact1,
        },
        theme: { color: "#000000" },
        handler: async (response: any) => {
          try {
            // 2) Verify signature server-side. This only flips status to "paid".
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();

            if (!verifyData.success) {
              // Payment succeeded at Razorpay but our verify failed.
              // The webhook will reconcile — send them to the pending page.
              router.push(`/order-pending?order_id=${orderId}`);
              return;
            }

            fbEvent(
              "Purchase",
              { ...buildPixelPayload(), value: paymentAmount },
              response.razorpay_payment_id,
            );

            localStorage.removeItem("cart");
            router.push(
              `/order-confirmed?order_id=${orderId}&payment_id=${response.razorpay_payment_id}`,
            );
          } catch {
            // Same reasoning — webhook reconciles.
            router.push(`/order-pending?order_id=${orderId}`);
          }
        },
        modal: {
          ondismiss: () => setIsLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", async (resp: any) => {
        fbTrackCustom("PaymentFailed", {
          value: paymentAmount,
          currency: "INR",
          reason: resp?.error?.description || "unknown",
        });
        // Order already exists in Sanity as "pending".
        // Redirect to a retry page that reuses the same Sanity order.
        router.push(`/order-failed?order_id=${orderId}`);
      });

      rzp.open();
    } catch (err: any) {
      setFormErrors([err?.message || "We couldn't start the payment. Please try again."]);
      setIsLoading(false);
    }
  };

  if (!cartItems.length || !mainProduct) {
    return <EmptyCart isInvalid={cartItems.length > 0} />;
  }

  return (
    <main className="container mx-auto px-4 max-w-2xl min-h-screen pb-28">
      <div className="py-6">
        <StepProgress currentStep={currentStep} />

        {formErrors.length > 0 && (
          <Alert variant="destructive" className="mb-4 rounded-xl">
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
          <div>
            <h2 className="text-base font-semibold mb-1">Delivery details</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Enter your details for order delivery
            </p>
            <CustomerDetailsForm
              customerDetails={customerDetails}
              handleInputChange={handleInputChange}
              handleInputBlur={handleInputBlur}
              getFieldError={getFieldError}
            />
          </div>
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
          <p className="text-xs text-muted-foreground mt-3 text-center">
            ₹{COD_ADVANCE_AMOUNT} advance now, ₹{remainingAmount} on delivery
          </p>
        )}
      </div>

      {currentStep === "details" && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t py-2">
          <div className="container mx-auto px-4 max-w-2xl">
            <Button
              onClick={handleRazorpayPayment}
              disabled={isLoading}
              className="w-full h-12 text-sm font-medium rounded-md flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                </>
              ) : isCod ? (
                `Pay ₹${COD_ADVANCE_AMOUNT} advance`
              ) : (
                `Pay now — ₹${totalAmount}`
              )}
            </Button>
            {!isFormValid && (
              <p className="text-xs text-center text-red-500 mt-2">
                Fill all required fields to continue
              </p>
            )}
            <p className="text-xs text-center text-muted-foreground mt-2">
              Secure payment via Razorpay · Estimated delivery {activeDelivery.label}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}