// app/api/razorpay/order/route.ts
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { serverClient } from "@/lib/sanity-server"; // write-enabled
import {
  BASE_PRICE,
  COD_CHARGE,
  SHOE_CLEANER_PRICE,
} from "@/lib/checkout-constants";

const COD_ADVANCE_AMOUNT = 300;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,               // [{ productId, size, isFreeItem }]
      customerDetails,
      shippingMethod,
      shoeCleanerAddon,
      freeSocksOffer,
    } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    if (!customerDetails?.name || !customerDetails?.contact1 || !customerDetails?.address) {
      return NextResponse.json({ error: "Missing customer details" }, { status: 400 });
    }
    if (!/^\d{10}$/.test(customerDetails.contact1.trim())) {
      return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
    }
    if (!/^\d{6}$/.test((customerDetails.pincode || "").trim())) {
      return NextResponse.json({ error: "Invalid pincode" }, { status: 400 });
    }

    // 1. Fetch real product data from Sanity
    const productIds = items.map((i: any) => i.productId).filter(Boolean);
    const products = await serverClient.fetch(
      `*[_type == "product" && _id in $ids]{ _id, price, name, "imageUrl": image.asset->url, buyOneGetOne }`,
      { ids: productIds }
    );
    const productMap = new Map(products.map((p: any) => [p._id, p]));

    // 2. Recompute totals server-side (never trust client)
    const mainProduct:any = productMap.get(items[0].productId);
    if (!mainProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 400 });
    }

    let subtotal = BASE_PRICE;
    const lineItems = [
      {
        _key: items[0].productId,
        productId: items[0].productId,
        productName: mainProduct.name,
        imageUrl: mainProduct.imageUrl,
        size: items[0].size,
        price: BASE_PRICE + Math.max(0, (mainProduct.price || BASE_PRICE) - BASE_PRICE),
        isFreeItem: false,
      },
    ];

    // If BOGO, validate the free product
    if (mainProduct.buyOneGetOne && items.length > 1) {
      const free:any = productMap.get(items[1].productId);
      if (!free) {
        return NextResponse.json({ error: "Free product not found" }, { status: 400 });
      }
      const freePrice = BASE_PRICE + Math.max(0, (free.price || BASE_PRICE) - BASE_PRICE);
      subtotal += Math.max(0, freePrice - BASE_PRICE); // only the upgrade delta
      lineItems.push({
        _key: items[1].productId,
        productId: items[1].productId,
        productName: free.name,
        imageUrl: free.imageUrl,
        size: items[1].size,
        price: freePrice,
        isFreeItem: true,
      });
    }

    const isCod = shippingMethod === "cod";
    const shippingCharge = isCod ? COD_CHARGE : 0;
    const cleanerCharge = shoeCleanerAddon ? SHOE_CLEANER_PRICE : 0;
    const totalAmount = subtotal + shippingCharge + cleanerCharge;
    const paymentAmount = isCod ? COD_ADVANCE_AMOUNT : totalAmount;
    const remainingAmount = isCod ? totalAmount - COD_ADVANCE_AMOUNT : 0;

    // 3. Create Sanity order FIRST (status: pending)
    const sanityOrder = await serverClient.create({
      _type: "order",
      status: "pending",
      createdAt: new Date().toISOString(),
      customerDetails,
      items: lineItems,
      shippingMethod,
      isCod,
      shoeCleanerAddon: !!shoeCleanerAddon,
      freeSocksOffer: !!freeSocksOffer,
      subtotal,
      shippingCharge,
      totalAmount,
      advancePaid: paymentAmount,
      remainingAmount,
    });

    // 4. Create Razorpay order
    const rzpOrder = await razorpay.orders.create({
      amount: paymentAmount * 100, // paise
      currency: "INR",
      receipt: sanityOrder._id,    // <- link both directions
      notes: {
        sanityOrderId: sanityOrder._id,
        isCod: String(isCod),
        remainingAmount: String(remainingAmount),
      },
    });

    // 5. Save razorpay_order_id back to Sanity (atomic-ish link)
    await serverClient
      .patch(sanityOrder._id)
      .set({ razorpayOrderId: rzpOrder.id })
      .commit();

    return NextResponse.json({
      orderId: sanityOrder._id,
      razorpayOrder: {
        id: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
      },
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      paymentAmount,
      remainingAmount,
      isCod,
    });
  } catch (err: any) {
    console.error("[razorpay/order]", err);
    return NextResponse.json(
      { error: err?.message || "Could not create order" },
      { status: 500 }
    );
  }
}