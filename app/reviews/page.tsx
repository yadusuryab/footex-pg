"use client";

import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { client } from "@/sanityClient";

interface ReviewImage {
  asset: { _ref: string };
}

interface Review {
  _id: string;
  customerName: string;
  rating: number;
  reviewText?: string;
  reviewImages?: ReviewImage[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
  shoe?: { productName: string; _id: string };
}

function splitIntoColumns(items: string[], count: number) {
  const cols: string[][] = Array.from({ length: count }, () => []);
  items.forEach((item, i) => cols[i % count].push(item));
  return cols;
}

const DURATIONS = [28, 35, 22, 40];

function MarqueeColumn({
  images,
  duration,
  reverse,
  onSelect,
}: {
  images: string[];
  duration: number;
  reverse?: boolean;
  onSelect: (src: string) => void;
}) {
  const loopImages = [...images, ...images];

  return (
    <div className="relative h-full rounded-xl overflow-hidden">
      <div
        className="flex flex-col gap-4 animate-marquee"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {loopImages.map((src, i) => (
          <button
            key={`${src}-${i}`}
            onClick={() => onSelect(src)}
            className="relative w-full aspect-[9/16] shadow-lg rounded-xl overflow-hidden shadow-md cursor-pointer group"
          >
            <Image
              src={src}
              alt="Customer review"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  const [images, setImages] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApprovedReviewImages();
  }, []);

  const fetchApprovedReviewImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch only approved reviews with images
      const data = await client.fetch<Review[]>(
        `*[_type == "review" && isApproved == true && count(reviewImages) > 0] | order(createdAt desc) {
          _id,
          customerName,
          reviewImages[] {
            asset->{
              _id,
              url
            }
          }
        }`
      );

      console.log("Fetched approved reviews with images:", data);

      // Extract all image URLs from all reviews
      const allImages: string[] = [];
      data.forEach((review) => {
        review.reviewImages?.forEach((img:any) => {
          if (img.asset?.url) {
            allImages.push(img.asset.url);
          }
        });
      });

      console.log("Extracted image URLs:", allImages);
      setImages(allImages);
    } catch (err) {
      console.error("Error fetching review images:", err);
      setError("Failed to load review images. Please try again later.");
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  // Alternative: If you want to use image references and construct URLs manually
  const getImageUrl = (image: ReviewImage): string | null => {
    try {
      const ref = image?.asset?._ref;
      if (!ref) return null;
      
      // If the ref is already a URL (from Sanity's asset URL)
      if (ref.startsWith('http')) return ref;
      
      // Parse the Sanity asset reference
      const parts = ref.split("-");
      if (parts.length >= 3) {
        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id";
        const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
        return `https://cdn.sanity.io/images/${projectId}/${dataset}/${parts[1]}-${parts[2]}.${parts[3] || "jpg"}`;
      }
      return null;
    } catch {
      return null;
    }
  };

  const mobileCols = useMemo(() => splitIntoColumns(images, 2), [images]);
  const desktopCols = useMemo(() => splitIntoColumns(images, 4), [images]);

  if (loading) {
    return (
      <section className="w-screen h-screen flex flex-col items-center justify-center px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-600">Loading reviews...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-screen h-screen flex flex-col items-center justify-center px-4">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-800">{error}</p>
        <button
          onClick={fetchApprovedReviewImages}
          className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className="w-screen h-screen flex flex-col items-center justify-center px-4">
        <div className="text-gray-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-800">No approved reviews with images yet</p>
        <p className="text-sm text-gray-500 mt-2">Check back soon!</p>
      </section>
    );
  }

  return (
    <section className="w-screen h-screen flex flex-col px-4">
      <h2 className="text-center text-3xl font-semibold mb-6 shrink-0">
        Happy Customers
      </h2>

      <div className="grid grid-cols-2 gap-4 flex-1 min-h-0 md:hidden">
        {mobileCols.map((col, i) => (
          <MarqueeColumn
            key={`mobile-${i}`}
            images={col}
            duration={DURATIONS[i]}
            reverse={i % 2 === 1}
            onSelect={setSelected}
          />
        ))}
      </div>

      <div className="hidden md:grid grid-cols-4 gap-4 flex-1 min-h-0">
        {desktopCols.map((col, i) => (
          <MarqueeColumn
            key={`desktop-${i}`}
            images={col}
            duration={DURATIONS[i]}
            reverse={i % 2 === 1}
            onSelect={setSelected}
          />
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-label="Close"
            className="absolute top-6 right-6 z-[110] w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div
            className="relative w-full max-w-sm aspect-[9/16]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selected}
              alt="Customer review"
              fill
              className="object-contain rounded-xl"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </section>
  );
}