import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Truck,
  ShieldCheck,
  Headphones,
  BadgeCheck,
} from "lucide-react";
import { site } from "@/lib/site-config";
import { getShoeById } from "@/lib/vehicleQueries";
import ProductCarousel from "@/components/product/product-carousel";
import ProductPurchase from "@/components/product/product-purchase";
import { ONE_PAIR_PRICE } from "@/lib/checkout-constants";

interface ProductProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getShoeById(id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for does not exist.",
    };
  }

  const { productName, price } = product;
  const ogDescription = `${productName} - ₹${price.toLocaleString("en-IN")}. Buy now!`;

  return {
    title: `${productName} - ${site.name}`,
    description: ogDescription,
    openGraph: { title: productName, description: ogDescription },
  };
}

const PERKS = [
  { icon: Truck, title: "UPI · Cards · COD", sub: "Pay your way" },
  { icon: ShieldCheck, title: "Secure checkout", sub: "Powered by Razorpay" },
  { icon: Headphones, title: "Easy support", sub: "We're a message away" },
];

export default async function ProductPage({ params }: ProductProps) {
  const { id } = await params;
  const product = await getShoeById(id);

  if (!product) return notFound();

  const {
    productName,
    shoeBrand,
    category,
    sizes,
    colorVariants,
    images,
    description,
    madeIn,
    price,
  } = product;

  const first = images?.[0];
  const imageUrl: string | undefined =
    typeof first === "string" ? first : first?.thumbnail || first?.url;

  const showMrp = typeof price === "number" && price > ONE_PAIR_PRICE;
  const discount = showMrp
    ? Math.round(((price - ONE_PAIR_PRICE) / price) * 100)
    : 0;

  const specs = [
    { label: "Brand", value: shoeBrand },
    { label: "Category", value: category },
    { label: "Made in", value: madeIn },
    { label: "Colours", value: colorVariants?.join(", ") },
    { label: "Sizes (UK)", value: sizes?.join(", ") },
  ].filter((s) => s.value);

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 pb-28 md:pb-16">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex w-fit items-center gap-1.5 text-xs text-muted-foreground py-4 md:py-6"
      >
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="size-3 shrink-0" />
        <Link
          href="/offer?pair=one"
          className="hover:text-foreground transition-colors"
        >
          One Pair Offer
        </Link>
        <ChevronRight className="size-3 shrink-0" />
        <span className="text-foreground font-medium truncate max-w-[40vw]">
          {productName}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14">
        {/* Gallery */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 self-start">
          <div className="rounded-3xl overflow-hidden bg-muted">
            <ProductCarousel images={images} productName={productName} />
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-5">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium tracking-wide text-muted-foreground">
                {shoeBrand || site.name}
              </span>
              {discount > 0 && (
                <span className="text-[11px] font-semibold bg-foreground text-background px-2.5 py-1 rounded-full">
                  {discount}% OFF
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-4xl font-bold leading-tight tracking-tight">
              {productName}
            </h1>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-3xl font-bold tracking-tight">
                ₹{ONE_PAIR_PRICE.toLocaleString("en-IN")}
              </span>
              {showMrp && (
                <span className="text-base text-muted-foreground line-through">
                  ₹{price.toLocaleString("en-IN")}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-green-700 px-2.5 py-1 rounded-full text-white ml-auto">
                <BadgeCheck className="size-3" />
                Incl. all taxes
              </span>
            </div>
          </div>

          <div className="h-px bg-border my-6" />

          {/* Size + Buy */}
          <ProductPurchase product={product} imageUrl={imageUrl} phone={site.phone} />

          {/* Perks */}
          <div className="grid grid-cols-3 gap-2 mt-6">
            {PERKS.map(({ icon: Icon, title, sub }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center gap-1.5 rounded-2xl bg-muted px-2 py-4"
              >
                <Icon className="h-5 w-5" strokeWidth={1.5} />
                <span className="text-[11px] font-semibold leading-tight">
                  {title}
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight">
                  {sub}
                </span>
              </div>
            ))}
          </div>

          {/* Accordions */}
          <div className="mt-6 space-y-3">
            <details className="group rounded-2xl border px-4" open>
              <summary className="flex items-center justify-between py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="text-sm font-semibold">Description</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {description || "No description available."}
              </p>
            </details>

            <details className="group rounded-2xl border px-4">
              <summary className="flex items-center justify-between py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="text-sm font-semibold">Details</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <dl className="pb-2 text-sm">
                {specs.map((s) => (
                  <div
                    key={s.label}
                    className="flex justify-between gap-6 py-3 border-t first:border-t-0"
                  >
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd className="font-medium text-right capitalize">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </details>
          </div>
        </div>
      </div>
    </main>
  );
}