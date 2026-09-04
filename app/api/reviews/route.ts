// app/api/reviews/route.ts
import { getReviewImages } from "@/lib/vehicleQueries";
import { NextResponse } from "next/server";

export async function GET() {
  const images = await  getReviewImages();
  return NextResponse.json({ images });
}