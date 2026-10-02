import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function POST(request: NextRequest) {
  try {
    const { amount, receipt } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: receipt || `rcpt_${Date.now()}`,
    });

    return NextResponse.json({ order });
  } catch (err) {
    console.error("Razorpay order error:", err);
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }
}