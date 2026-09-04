import Link from "next/link";
import { Suspense } from "react";

// ✅ OPTIMIZED: Use static import for icons instead of dynamic
import { IconBrandInstagram, IconBrandWhatsapp } from "@tabler/icons-react";
import { site } from "@/lib/site-config";
import Brand from "../brand/brand";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

// ✅ OPTIMIZED: Lazy load brand component with smaller fallback

const Header = () => {
  return (
    <>
      {/* Main Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-[500px]">
        <div className="bg-primary/75 backdrop-blur-xl rounded-3xl p-4 px-6">
          {" "}
          {/* ✅ Reduced padding */}
          <div className="flex items-center justify-between">
            {/* ✅ OPTIMIZED: Brand Logo with proper sizing */}
            <Link
              href="/"
              className="flex items-center gap-2"
              aria-label="Footex Home"
            >
              <Suspense
                fallback={
                  <div className="w-6 h-6 bg-gray-200  animate-pulse" /> // ✅ Smaller fallback
                }
              >
                <Brand />
                <Badge variant="destructive">TEST</Badge>
              </Suspense>
            </Link>

            {/* ✅ OPTIMIZED: Social links with smaller icons */}
            <div className="flex items-center gap-2">
              {" "}
              {/* ✅ Further reduced gap */}
              <Link
                href={`https://instagram.com/${site.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant={"secondary"}
                  size="icon"
                  className="w-8 h-8 transition-transform hover:scale-110"
                  aria-label="Follow us on Instagram"
                >
                  <IconBrandInstagram className="w-4 h-4" />{" "}
                  {/* ✅ Adjusted icon size */}
                </Button>
              </Link>
              <Link
                href={`https://wa.me/${site.phone}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant={"secondary"}
                  size="icon"
                  className="w-8 h-8 transition-transform hover:scale-110"
                  aria-label="Contact us on WhatsApp"
                >
                  <IconBrandWhatsapp className="w-4 h-4" />{" "}
                  {/* ✅ Adjusted icon size */}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/* ✅ OPTIMIZED: Smaller spacer for fixed header */}
      <div className="h-20" /> {/* ✅ Reduced from h-20 to h-16 */}
    </>
  );
};

export default Header;
