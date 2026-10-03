"use client";

import { useEffect, useState } from "react";
import BrandStory from "@/components/sections/brand-story-about";
import { FreeSocksPromo } from "@/components/sections/free-socks";
import { Hero } from "@/components/sections/hero";
import { ReviewsBento } from "@/components/sections/review-bento";
import { ProductCardWithSale } from "@/components/sections/sale-is-live";
import { client } from "@/sanityClient";
import { OrderTrackCTA } from "@/components/sections/order-track";
import { ShopVideo } from "@/components/layout/sv";

export default function Home() {
  const [freeSocksOffer, setFreeSocksOffer] = useState(false);

  useEffect(() => {
    client
      .fetch(`*[_type == "settings"]`)
      .then((data) => {
        console.log(data[0]);
        setFreeSocksOffer(!!data[0].freeSocksOffer);
      })
      .catch(() => setFreeSocksOffer(false));
  }, []);

  return (
    <div className="py-4 md:px-6    min-h-screen">
      <div className="md:flex md:justify-center md:items-start ">
        <div>
 <div className="px-4 my-2 md:max-w-[400px] w-full mx-auto ">          <Hero />
        </div>
        {freeSocksOffer && (
            <div className="px-4 my-2 md:max-w-[400px] w-full mx-auto ">
              <FreeSocksPromo />
            </div>
          )}
        </div>
        <div>
          <div className="px-4 my-2 md:max-w-[400px] w-full mx-auto ">
            <OrderTrackCTA />
          </div>
          <div className="px-4 my-2 md:max-w-[400px] w-full mx-auto ">
            <ReviewsBento />
           
          </div>
           <div className="px-4 my-2 md:max-w-[400px] w-full mx-auto ">
              <ShopVideo />
            </div>
        </div>
      </div>

      {/* <BrandStory /> */}
    </div>
  );
}
