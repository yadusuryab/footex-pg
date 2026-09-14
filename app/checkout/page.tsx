"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { CustomerDetailsForm } from "@/components/checkout/checkout-form";
import { site } from "@/lib/site-config";
import { client } from "@/sanityClient";

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
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [orderDate] = useState<Date>(() => new Date());

  const [freeSocksOffer, setFreeSocksOffer] = useState(false);
  const [shoeCleanerAddon, setShoeCleanerAddon] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [razorpayReady, setRazorpayReady] = useState(false);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({ ...prev, [name]: value }));
    if (formErrors.length > 0) setFormErrors([]);
  };

  const validateDetails = (): string[] => {
    const errors: string[] = [];
    if (!customerDetails.name) errors.push("Name is required.");
    if (!customerDetails.contact1) errors.push("Contact number is required.");
    if (!customerDetails.address) errors.push("Address is required.");
    if (!customerDetails.district) errors.push("District is required.");
    if (!customerDetails.state) errors.push("State is required.");
    if (!customerDetails.pincode) errors.push("Pincode is required.");
    return errors;
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

  const handleRazorpayPayment = async () => {
    const errors = validateDetails();
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    if (!razorpayReady || typeof window.Razorpay === "undefined") {
      setFormErrors(["Payment gateway is still loading. Please try again in a moment."]);
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
              setFormErrors(["Payment verification failed. Please contact support."]);
              setIsLoading(false);
              return;
            }

            localStorage.removeItem("cart");
            router.push(`/order-confirmed?payment_id=${response.razorpay_payment_id}`);
          } catch {
            setFormErrors(["Something went wrong confirming your payment."]);
            setIsLoading(false);
          }
        },
        modal: {
          ondismiss: () => setIsLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        setFormErrors(["Payment failed. Please try again."]);
        setIsLoading(false);
      });
      rzp.open();
    } catch (err) {
      setIsLoading(false);
      setFormErrors(["Failed to start payment. Please try again."]);
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
            onContinue={() => setCurrentStep("details")}
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
            <p className="text-xs text-center text-muted-foreground mt-2">
              Secure payment via Razorpay • Estimated delivery {activeDelivery.label}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}