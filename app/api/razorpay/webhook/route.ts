import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { finalizeOrder } from "@/lib/server/finalize-order";

export async function POST(request: NextRequest) {
  const raw = await request.text();
  const sig = request.headers.get("x-razorpay-signature") || "";
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET as string)
    .update(raw)
    .digest("hex");

  if (sig.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const event = JSON.parse(raw);
    if (event.event === "order.paid" || event.event === "payment.captured") {
      const pay = event.payload?.payment?.entity;
      if (pay?.order_id) {
        const order = await finalizeOrder(pay.order_id, pay.id);
        if (!order) throw new Error(`No pending order for ${pay.order_id}`);
      }
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Webhook error:", e);
    return NextResponse.json({ ok: false }, { status: 500 }); // Razorpay retries for ~24h
  }
}