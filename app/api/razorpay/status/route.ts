import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { sanity } from "@/lib/sanity-server";
import { finalizeOrder } from "@/lib/server/finalize-order";

export const dynamic = "force-dynamic";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("order_id") || "";
  if (!id.startsWith("order_")) return NextResponse.json({ paid: false }, { status: 400 });

  let order: any = await sanity.getDocument(`order-${id}`);
  if (!order && (await sanity.getDocument(`pending-${id}`))) {
    const pays = await razorpay.orders.fetchPayments(id);
    const captured = pays.items.find((p: any) => p.status === "captured");
    if (captured) order = await finalizeOrder(id, captured.id);
  }
  return NextResponse.json({
    paid: !!order,
    paymentId: order?.razorpayPaymentId ?? null,
  });
}