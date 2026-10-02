import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { sanity } from "@/lib/sanity-server";
import { finalizeOrder } from "@/lib/server/finalize-order";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function GET(request: NextRequest) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const since = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

  const pendings: { razorpayOrderId: string }[] = await sanity.fetch(
    `*[_type == "pendingOrder" && !defined(finalizedAt) && createdAt < $cutoff && createdAt > $since]{ razorpayOrderId }`,
    { cutoff, since },
  );

  let recovered = 0;
  for (const { razorpayOrderId } of pendings) {
    try {
      const pays = await razorpay.orders.fetchPayments(razorpayOrderId);
      const captured = pays.items.find((p: any) => p.status === "captured");
      if (captured && (await finalizeOrder(razorpayOrderId, captured.id))) recovered++;
    } catch (e) {
      console.error("[reconcile]", razorpayOrderId, e);
    }
  }
  return NextResponse.json({ ok: true, checked: pendings.length, recovered });
}