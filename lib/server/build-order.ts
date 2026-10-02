import "server-only";
import { sanity } from "@/lib/sanity-server";
import {
  BASE_PRICE,
  COD_CHARGE,
  SHOE_CLEANER_PRICE,
  COD_ADVANCE_AMOUNT,
} from "@/lib/checkout-constants";

export async function buildOrder(input: any) {
  const c = input?.customerDetails ?? {};
  const required = ["name", "contact1", "address", "district", "state", "pincode"];
  if (required.some((f) => !String(c[f] ?? "").trim()))
    return { error: "Missing customer details" };
  if (!/^\d{10}$/.test(String(c.contact1).trim())) return { error: "Invalid phone" };
  if (!/^\d{6}$/.test(String(c.pincode).trim())) return { error: "Invalid pincode" };

  const items: any[] = Array.isArray(input?.items) ? input.items.slice(0, 2) : [];
  if (!items.length || !items[0]?.productId) return { error: "Invalid items" };

  const ids = items.map((i) => i.productId).filter(Boolean);
  const [products, settings] = await Promise.all([
    sanity.fetch(`*[_id in $ids]{ _id, price }`, { ids }),
    sanity.fetch(`*[_type == "settings"][0]{ shoeCleanerAddon }`),
  ]);

  // same rule as the client: price || BASE_PRICE
  const priced = items.map((i, idx) => ({
    ...i,
    price: products.find((p: any) => p._id === i.productId)?.price || BASE_PRICE,
    isFreeItem: idx === 1,
  }));

  const extra = (p: number) => Math.max(0, p - BASE_PRICE);
  const subtotal = BASE_PRICE + extra(priced[0].price) + extra(priced[1]?.price ?? BASE_PRICE);
  const isCod = input.shippingMethod === "cod";
  const shippingCharge = isCod ? COD_CHARGE : 0;
  const cleaner = !!(settings?.shoeCleanerAddon && input.shoeCleanerAddon);
  const totalAmount = subtotal + shippingCharge + (cleaner ? SHOE_CLEANER_PRICE : 0);
  const advancePaid = isCod ? COD_ADVANCE_AMOUNT : totalAmount;

  return {
    amount: advancePaid,
    payload: {
      items: priced,
      customerDetails: c,
      shippingMethod: isCod ? "cod" : "online",
      shoeCleanerAddon: cleaner,
      freeSocksOffer: !!input.freeSocksOffer,
      subtotal,
      shippingCharge,
      totalAmount,
      isCod,
      advancePaid,
      remainingAmount: isCod ? totalAmount - COD_ADVANCE_AMOUNT : 0,
      expectedDeliveryLabel: input.expectedDeliveryLabel,
    },
  };
}