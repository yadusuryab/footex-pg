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
    <div className="flex py-0 px-4 flex-col min-h-screen">
      <div className="relative overflow-hidden">
       
          <Hero />
        
      </div>
        <div className="px-4 my-8">
        <ProductCardWithSale />
      </div>
<div className="px-4 mt-4 ">
        <OrderTrackCTA/>
    </div>
      {freeSocksOffer && (
        <div className="px-4 my-8">
          <FreeSocksPromo />
        </div>
      )}
    

      <div className="px-4 my-8">
        <ReviewsBento />
      </div>
      <ShopVideo/>

     

      {/* <BrandStory /> */}
    </div>
  );
}