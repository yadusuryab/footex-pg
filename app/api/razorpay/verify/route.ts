import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { client } from "@/sanityClient";

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderPayload,
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET as string;
    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    let orderDoc = null;
    if (orderPayload) {
      const {
        items = [],
        customerDetails = {},
        shippingMethod,
        shoeCleanerAddon,
        freeSocksOffer,
        subtotal,
        shippingCharge,
        totalAmount,
        expectedDeliveryLabel,
      } = orderPayload;

      orderDoc = await client.create({
        _type: "order",
        orderId: razorpay_order_id,
        items: items.map((item: any) => ({
          _type: "orderItem",
          _key: crypto.randomUUID(),
          product: item.productId
            ? { _type: "reference", _ref: item.productId }
            : undefined,
          imageUrl: item.imageUrl,
          productName: item.productName,
          size: item.size,
          price: item.price,
          isFreeItem: !!item.isFreeItem,
        })),
        customerName: customerDetails.name,
        instagramId: customerDetails.instagramId,
        contact1: customerDetails.contact1,
        contact2: customerDetails.contact2,
        address: customerDetails.address,
        district: customerDetails.district,
        state: customerDetails.state,
        pincode: customerDetails.pincode,
        landmark: customerDetails.landmark,
        shippingMethod,
        shoeCleanerAddon: !!shoeCleanerAddon,
        freeSocksOffer: !!freeSocksOffer,
        subtotal,
        shippingCharge,
        totalAmount,
        expectedDeliveryLabel,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        paymentStatus: "paid",
        fulfillmentStatus: "pending",
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, orderId: orderDoc?._id });
  } catch (err) {
    console.error("Razorpay verify error:", err);
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
  }
}