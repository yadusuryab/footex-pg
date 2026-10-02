// app/api/razorpay/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { serverClient } from "@/lib/sanity-server";

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(raw)
    .digest("hex");

  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(raw);
  const payment = event?.payload?.payment?.entity;
  const razorpayOrderId = payment?.order_id;
  const razorpayPaymentId = payment?.id;

  if (!razorpayOrderId) {
    return NextResponse.json({ ok: true });
  }

  const order = await serverClient.fetch(
    `*[_type == "order" && razorpayOrderId == $rid][0]{ _id, status }`,
    { rid: razorpayOrderId }
  );

  if (!order) {
    console.warn("[webhook] No Sanity order for", razorpayOrderId);
    return NextResponse.json({ ok: true });
  }

  if (event.event === "payment.captured" && order.status !== "paid") {
    await serverClient
      .patch(order._id)
      .set({
        status: "paid",
        razorpayPaymentId,
        paidAt: new Date().toISOString(),
        paidVia: "webhook",
      })
      .commit();
  }

  if (event.event === "payment.failed") {
    await serverClient
      .patch(order._id)
      .set({
        status: "payment_failed",
        razorpayPaymentId,
        failedAt: new Date().toISOString(),
      })
      .commit();
  }

  return NextResponse.json({ ok: true });
}