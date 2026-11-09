// lib/checkout-pricing.ts
import {
  BASE_PRICE,
  ONE_PAIR_PRICE,
  SHOE_CLEANER_PRICE,
  COD_ADVANCE_AMOUNT,
} from "@/lib/checkout-constants";
import { getShippingBreakdown, OfferType } from "@/lib/checkout-shipping";

// Re-exported in case other files still import it from here
export { COD_ADVANCE_AMOUNT };

export type CartLineInput = {
  productId: string;
  selectedSize: string;
  isFreeItem?: boolean;
};

export type PricedCart = {
  subtotal: number;
  shippingCharge: number;
  cleanerCharge: number;
  totalAmount: number;
  isCod: boolean;
  paymentAmount: number;
  remainingAmount: number;
  items: Array<{
    productId: string;
    productName: string;
    imageUrl: string;
    size: string;
    price: number;
    isFreeItem: boolean;
  }>;
};

/**
 * Advance paid upfront for COD orders.
 *  - One pair: equals the COD shipping charge (₹150 Kerala / ₹200 outside)
 *  - Two pair: flat ₹300
 * Used by both the client (display) and the server (amount charged).
 */
export function getCodAdvance(offerType: OfferType, state: string): number {
  if (offerType === "one-pair") {
    return getShippingBreakdown({
      offerType,
      shippingMethod: "cod",
      state,
    }).total;
  }
  return COD_ADVANCE_AMOUNT;
}

export async function priceCart(
  sanity: any,
  lines: CartLineInput[],
  opts: {
    shippingMethod: "online" | "cod";
    addShoeCleaner: boolean;
    offerType?: OfferType; // defaults to "two-pair"
    state?: string; // selected delivery state, drives outside-Kerala charge
  }
): Promise<PricedCart> {
  if (!lines.length) throw new Error("Cart is empty");
  if (lines.length > 2) throw new Error("Max 2 items per order");

  const offerType: OfferType = opts.offerType === "one-pair" ? "one-pair" : "two-pair";
  const isOnePair = offerType === "one-pair";

  // One pair: exactly one paid line, never a free item
  if (isOnePair && (lines.length !== 1 || lines[0].isFreeItem)) {
    throw new Error("Invalid one pair order");
  }

  const ids = lines.map((l) => l.productId);

  const products = await sanity.fetch(
    `*[_type == "shoe" && _id in $ids]{
      _id,
      productName,
      price,
      "rawImage": coalesce(images[0].asset->url, "")
    }`,
    { ids }
  );

  const byId = new Map(products.map((p: any) => [p._id, p]));

  const missing: string[] = [];
  const built = lines.map((l) => {
    const p: any = byId.get(l.productId);
    if (!p) {
      missing.push(l.productId);
      return null;
    }
    return {
      productId: p._id,
      productName: p.productName ?? "Unknown product",
      imageUrl: p.rawImage
        ? `${p.rawImage}?w=400&h=400&auto=format&q=85&fit=crop`
        : "",
      size: l.selectedSize,
      // One pair is a flat price for any shoe; two pair uses the product price
      price: isOnePair
        ? ONE_PAIR_PRICE
        : typeof p.price === "number"
          ? p.price
          : BASE_PRICE,
      isFreeItem: !!l.isFreeItem,
    };
  });

  if (missing.length) {
    const err: any = new Error(
      `Some products are no longer available: ${missing.join(", ")}`
    );
    err.code = "PRODUCT_NOT_FOUND";
    err.missingProductIds = missing;
    throw err;
  }

  const items = built as NonNullable<(typeof built)[number]>[];

  // One pair: flat ₹800, no extras. Two pair: ₹1499 + extras above standard price.
  const pair1Extra = isOnePair ? 0 : Math.max(0, items[0].price - BASE_PRICE);
  const pair2Extra =
    !isOnePair && items[1] ? Math.max(0, items[1].price - BASE_PRICE) : 0;
  const offerBasePrice = isOnePair ? ONE_PAIR_PRICE : BASE_PRICE;
  const subtotal = offerBasePrice + pair1Extra + pair2Extra;

  const state = opts.state ?? "";
  const isCod = opts.shippingMethod === "cod";
  const shippingCharge = getShippingBreakdown({
    offerType,
    shippingMethod: opts.shippingMethod,
    state,
  }).total;
  const cleanerCharge = opts.addShoeCleaner ? SHOE_CLEANER_PRICE : 0;
  const totalAmount = subtotal + shippingCharge + cleanerCharge;
  const paymentAmount = isCod ? getCodAdvance(offerType, state) : totalAmount;
  const remainingAmount = isCod ? totalAmount - paymentAmount : 0;

  return {
    subtotal,
    shippingCharge,
    cleanerCharge,
    totalAmount,
    isCod,
    paymentAmount,
    remainingAmount,
    items,
  };
}

export function generateOrderId() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `FTX-${ymd}-${rand}`;
}