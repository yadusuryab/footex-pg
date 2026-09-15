"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Loader2,
  Link as LinkIcon,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface OrderItem {
  productName: string;
  size?: string;
  price: number;
  isFreeItem?: boolean;
  imageUrl?: string;
}

interface Order {
  orderId: string;
  items: OrderItem[];
  customerName: string;
  contact1: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  landmark?: string;
  shippingMethod?: string;
  shoeCleanerAddon?: boolean;
  freeSocksOffer?: boolean;
  subtotal: number;
  shippingCharge: number;
  totalAmount: number;
  expectedDeliveryLabel?: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  createdAt: string;
}

const STEPS = [
  { key: "pending", label: "Placed", icon: Clock },
  { key: "processing", label: "Preparing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

function stepIndex(status: string) {
  const idx = STEPS.findIndex((s) => s.key === status?.toLowerCase());
  return idx === -1 ? 0 : idx;
}

function statusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  const s = status?.toLowerCase();
  if (s === "delivered") return "default";
  if (s === "cancelled" || s === "failed") return "destructive";
  if (s === "shipped" || s === "processing") return "secondary";
  return "outline";
}

// Perforated divider — the "tear line" on a shipping manifest / receipt.
function Perforation() {
  return (
    <div
      className="h-px w-full my-5"
      style={{
        backgroundImage:
          "repeating-linear-gradient(to right, var(--border) 0 6px, transparent 6px 14px)",
      }}
    />
  );
}

function TrackOrderContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [contact1, setContact1] = useState(searchParams.get("phone") ?? "");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  const digitsOnly = contact1.replace(/\D/g, "");
  const isValid = digitsOnly.length === 10;

  async function runSearch(phone: string) {
    setLoading(true);
    setError(null);
    setSearched(true);
    setOrders(null);

    try {
      const params = new URLSearchParams({ contact1: phone });
      const res = await fetch(`/api/orders/track?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "We couldn't find any orders for that number.");
        return;
      }

      setOrders(data.orders);
    } catch {
      setError("Something went wrong on our end. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Auto-run a search if the page was opened with ?phone=... in the URL
  // (e.g. a shared tracking link).
  useEffect(() => {
    const initial = searchParams.get("phone");
    if (initial && /^\d{10}$/.test(initial)) {
      runSearch(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    router.replace(`${pathname}?phone=${digitsOnly}`, { scroll: false });
    runSearch(digitsOnly);
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-5 py-14 md:py-20">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Where's my order?
          </h1>
          <p className="text-muted-foreground text-[15px] leading-relaxed  max-w-md">
            Enter the phone number you used at checkout. We'll pull up every order tied to it.
          </p>
        </div>

        <div>
  <label htmlFor="contact1" className="block text-sm text-muted-foreground mb-2">
    Phone number
  </label>

  <form
    onSubmit={handleSearch}
    className="flex flex-col sm:flex-row rounded-xl border border-input bg-card shadow-sm overflow-hidden transition-shadow focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
  >
    <Input
      id="contact1"
      type="tel"
      inputMode="numeric"
      autoComplete="tel"
      maxLength={10}
      value={contact1}
      onChange={(e) => setContact1(e.target.value)}
      placeholder="98765 43210"
      aria-invalid={contact1.length > 0 && !isValid}
      className="h-16 flex-1 border-0 rounded-none shadow-none text-2xl font-semibold tracking-tight tabular-nums px-5 focus-visible:ring-0"
    />
    <Button
      type="submit"
      disabled={!isValid || loading}
      className="h-16 sm:w-40 w-full text-lg font-semibold tracking-tight rounded-none border-t sm:border-t-0 sm:border-l border-primary-foreground/10"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Search className="h-5 w-5" />
      )}
      {loading ? "Searching" : "Track"}
    </Button>
  </form>

  {contact1.length > 0 && !isValid && (
    <p className="text-xs text-muted-foreground mt-2">
      Enter a valid 10-digit phone number.
    </p>
  )}
</div>
        {contact1.length > 0 && !isValid && (
          <p className="text-xs text-muted-foreground mt-1.5">
            Enter a valid 10-digit phone number.
          </p>
        )}

        {loading && (
          <div className="mt-8 space-y-3">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        )}

        {!loading && error && (
          <Alert variant="destructive" className="mt-8">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!loading && !error && searched && orders?.length === 0 && (
          <div className="mt-10 text-center py-10 border border-dashed rounded-lg">
            <Package className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No orders found for this number.
            </p>
          </div>
        )}

        {!loading && !error && orders && orders.length > 0 && (
          <>
            <div className="flex items-center justify-between mt-10 mb-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {orders.length === 1 ? "1 order found" : `${orders.length} orders found`}
              </p>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <LinkIcon className="h-3.5 w-3.5" />}
                {copied ? "Link copied" : "Copy link to this result"}
              </button>
            </div>

            <Accordion
              type="single"
              collapsible
              defaultValue={orders[0].orderId}
              className="space-y-3"
            >
              {orders.map((order) => {
                const cancelled = order.fulfillmentStatus?.toLowerCase() === "cancelled";
                const delivered = order.fulfillmentStatus?.toLowerCase() === "delivered";
                const idx = stepIndex(order.fulfillmentStatus);

                return (
                  <AccordionItem
                    key={order.orderId}
                    value={order.orderId}
                    className="border rounded-lg overflow-hidden bg-card"
                  >
                    <Card className="border-0 shadow-none py-0 gap-0">
                      <AccordionTrigger className="px-5 py-4 hover:no-underline [&>svg]:shrink-0">
                        <div className="flex items-center justify-between w-full pr-2">
                          <div className="text-left">
                            <p className="text-sm font-semibold text-foreground">
                              Order {order.orderId}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}{" "}
                              · ₹{order.totalAmount}
                            </p>
                          </div>

                          {/* Stamped status seal — leans into the shipping-label motif */}
                          <Badge
                            variant={statusBadgeVariant(order.fulfillmentStatus)}
                            className={`${
                              delivered || cancelled ? "-rotate-3 border-2" : ""
                            } capitalize`}
                          >
                            {order.fulfillmentStatus}
                          </Badge>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="px-5 pb-5">
                        <CardContent className="p-0">
                          <Perforation />

                          {cancelled ? (
                            <div className="flex items-center gap-2 text-destructive text-sm mb-1">
                              <XCircle className="h-4 w-4" />
                              This order was cancelled
                            </div>
                          ) : (
                            <div className="mb-1">
                              <div className="flex items-center">
                                {STEPS.map((step, i) => {
                                  const Icon = step.icon;
                                  const done = i <= idx;
                                  const current = i === idx;
                                  return (
                                    <div key={step.key} className="flex-1 flex items-center last:flex-none">
                                      <div className="flex flex-col items-center gap-1.5">
                                        <div
                                          className={`h-8 w-8 rounded-full flex items-center justify-center border transition-colors ${
                                            done
                                              ? "bg-primary text-primary-foreground border-primary"
                                              : "bg-muted text-muted-foreground border-border"
                                          } ${current ? "ring-2 ring-primary/30 ring-offset-2 ring-offset-card" : ""}`}
                                        >
                                          <Icon className="h-4 w-4" />
                                        </div>
                                        <span
                                          className={`text-[10px] text-center ${
                                            done ? "text-foreground font-medium" : "text-muted-foreground"
                                          }`}
                                        >
                                          {step.label}
                                        </span>
                                      </div>
                                      {i < STEPS.length - 1 && (
                                        <div
                                          className={`h-0.5 flex-1 mx-1 mb-4 rounded-full ${
                                            i < idx ? "bg-primary" : "bg-border"
                                          }`}
                                        />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {order.expectedDeliveryLabel && !cancelled && (
                            <p className="text-xs text-muted-foreground mt-4">
                              Expected delivery: <span className="text-foreground font-medium">{order.expectedDeliveryLabel}</span>
                            </p>
                          )}

                          <Perforation />

                          <div className="space-y-3">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex items-center gap-3">
                                {item.imageUrl && (
                                  <img
                                    src={item.imageUrl}
                                    alt={item.productName}
                                    className="h-12 w-12 rounded-md object-cover bg-muted border"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-foreground truncate">
                                    {item.productName}
                                    {item.isFreeItem && (
                                      <Badge variant="secondary" className="ml-1.5 text-[10px]">
                                        Free
                                      </Badge>
                                    )}
                                  </p>
                                  {item.size && (
                                    <p className="text-xs text-muted-foreground">Size {item.size}</p>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground shrink-0">₹{item.price}</p>
                              </div>
                            ))}
                          </div>

                          <Perforation />

                          <div className="flex items-start gap-2 text-xs text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                            <p>
                              {order.address}, {order.landmark ? `${order.landmark}, ` : ""}
                              {order.district}, {order.state} – {order.pincode}
                            </p>
                          </div>
                        </CardContent>
                      </AccordionContent>
                    </Card>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </>
        )}
      </div>
    </main>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background">
          <div className="mx-auto max-w-2xl px-5 py-14 md:py-20">
            <Skeleton className="h-9 w-64 mb-3" />
            <Skeleton className="h-5 w-80" />
          </div>
        </main>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}