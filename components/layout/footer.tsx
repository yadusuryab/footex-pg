import Link from "next/link";
import { site } from "@/lib/site-config";
import Brand from "../brand/brand";
import { HideOn } from "./header/menu-closer";
import { IconPhoneFilled } from "@tabler/icons-react";

const link =
  "font-bold text-black transition-colors hover:text-primary focus-visible:text-primary";

// Server component: static HTML/CSS. Only the tiny <HideOn/> gate runs on the client.
function Footer() {
  return (
    <HideOn routes={["/checkout"]}>
      <footer className="bg-muted px-4 py-10 text-white sm:px-6">
        <div className="flex  gap-8 md:flex-row md:justify-between bg-primary p-4 rounded-xl items-center">
          <Brand />

          <div className="flex flex-col gap-1 text-base md:items-end md:text-right">
            <a
              href={`tel:${site.phone}`}
              className={`text-xl text-black font-bold flex items-center`}
            >
              <IconPhoneFilled size={20} />
              <span className="ml-1">{site.phone}</span>
            </a>
            {site.address && (
              <p className="max-w-xs text-sm text-muted-foreground font-semibold">
                {site.address}
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-sm">
          <nav className="flex gap-6">
            <Link href="/privacy-policy" className={link}>
              Privacy
            </Link>
            <Link href="/T&C" className={link}>
              Terms
            </Link>
          </nav>
          <p className="text-muted-foreground font-semibold">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </HideOn>
  );
}

export { Footer };
