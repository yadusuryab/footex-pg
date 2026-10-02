import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { finalizeOrder } from "@/lib/server/finalize-order";

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const ok =
      expected.length === razorpay_signature.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature));
    if (!ok) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    const order = await finalizeOrder(razorpay_order_id, razorpay_payment_id);
    return NextResponse.json({ success: !!order, orderId: order?._id });
  } catch (err) {
    console.error("Razorpay verify error:", err);
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
  }
}