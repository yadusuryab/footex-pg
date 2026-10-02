// app/api/razorpay/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { serverClient } from "@/lib/sanity-server";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    // Verify signature
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    // Find the Sanity order already linked to this razorpay order
    const order = await serverClient.fetch(
      `*[_type == "order" && razorpayOrderId == $rid][0]{ _id, status }`,
      { rid: razorpay_order_id }
    );

    if (!order) {
      // Webhook likely hasn't landed yet, or order was created outside this flow.
      // Don't fail the client — the webhook will reconcile.
      return NextResponse.json({ success: true, reconciled: false });
    }

    if (order.status === "paid") {
      return NextResponse.json({ success: true, orderId: order._id });
    }

    await serverClient
      .patch(order._id)
      .set({
        status: "paid",
        razorpayPaymentId: razorpay_payment_id,
        paidAt: new Date().toISOString(),
      })
      .commit();

    return NextResponse.json({ success: true, orderId: order._id });
  } catch (err: any) {
    console.error("[razorpay/verify]", err);
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}