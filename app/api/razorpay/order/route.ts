import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { sanity } from "@/lib/sanity-server";
import { buildOrder } from "@/lib/server/build-order";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

const cut = (s: any) => String(s ?? "").slice(0, 250);

export async function POST(request: NextRequest) {
  try {
    const { orderPayload } = await request.json();
    const built = await buildOrder(orderPayload);
    if ("error" in built) {
      return NextResponse.json({ error: built.error }, { status: 400 });
    }
    const { amount, payload } = built;
    const c = payload.customerDetails;

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      // backup copy of the essentials inside Razorpay itself
      notes: {
        name: cut(c.name),
        phone: cut(c.contact1),
        address: cut(c.address),
        district: cut(c.district),
        state: cut(c.state),
        pincode: cut(c.pincode),
        isCod: String(payload.isCod),
      },
    });

    // Save the pending order BEFORE the customer can pay. Retry once.
    const doc = {
      _id: `pending-${order.id}`,
      _type: "pendingOrder",
      razorpayOrderId: order.id,
      payload: JSON.stringify(payload),
      createdAt: new Date().toISOString(),
    };
    try {
      await sanity.createIfNotExists(doc);
    } catch {
      await sanity.createIfNotExists(doc);
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error("Razorpay order error:", err);
    // failing here is safe: the customer has not paid yet
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }
}