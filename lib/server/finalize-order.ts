import "server-only";
import crypto from "crypto";
import { sanity } from "@/lib/sanity-server";

export async function finalizeOrder(razorpayOrderId: string, razorpayPaymentId: string) {
  const orderDocId = `order-${razorpayOrderId}`;

  const existing = await sanity.getDocument(orderDocId);
  if (existing) return existing;

  const pending: any = await sanity.getDocument(`pending-${razorpayOrderId}`);
  if (!pending?.payload) {
    console.error("[finalizeOrder] NO PENDING DOC", razorpayOrderId, razorpayPaymentId);
    return null;
  }
  const p = JSON.parse(pending.payload);
  const c = p.customerDetails ?? {};

  const order = await sanity.createIfNotExists({
    _id: orderDocId, // deterministic: duplicates are impossible
    _type: "order",
    orderId: razorpayOrderId,
    items: p.items.map((item: any) => ({
      _type: "orderItem",
      _key: crypto.randomUUID(),
      product: item.productId ? { _type: "reference", _ref: item.productId } : undefined,
      imageUrl: item.imageUrl,
      productName: item.productName,
      size: item.size,
      price: item.price,
      isFreeItem: !!item.isFreeItem,
    })),
    customerName: c.name,
    instagramId: c.instagramId,
    contact1: c.contact1,
    contact2: c.contact2,
    address: c.address,
    district: c.district,
    state: c.state,
    pincode: c.pincode,
    landmark: c.landmark,
    shippingMethod: p.shippingMethod,
    shoeCleanerAddon: !!p.shoeCleanerAddon,
    freeSocksOffer: !!p.freeSocksOffer,
    subtotal: p.subtotal,
    shippingCharge: p.shippingCharge,
    totalAmount: p.totalAmount,
    isCod: !!p.isCod,
    advancePaid: p.advancePaid,
    remainingAmount: p.remainingAmount,
    expectedDeliveryLabel: p.expectedDeliveryLabel,
    razorpayOrderId,
    razorpayPaymentId,
    paymentStatus: p.isCod ? "advance_paid" : "paid",
    fulfillmentStatus: "pending",
    createdAt: new Date().toISOString(),
  });

  try {
    await sanity
      .patch(`pending-${razorpayOrderId}`)
      .set({ finalizedAt: new Date().toISOString() })
      .commit();
  } catch {} // non-fatal

  return order;
}