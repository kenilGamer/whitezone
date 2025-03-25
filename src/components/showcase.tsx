"use client";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

const products = [
  { id: 1, name: "Core T-Shirt", price: "$75", image: "/img/image-removebg-preview.png" },
  { id: 2, name: "Core Hoodie", price: "$125", image: "/img/Hoodie.png" },
  { id: 3, name: "Core Shirt", price: "$90", image: "/img/image-removebg-preview (2).png" },
  { id: 3, name: "Core Shirt", price: "$90", image: "/img/image-removebg-preview (2).png" },
];

const Showcase = () => {
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="h-[90vh] w-full flex flex-col items-center justify-center">
      <div className="w-full p-2">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, Mousewheel, EffectCoverflow]}
          effect="coverflow"
          spaceBetween={0}
          slidesPerView={3}
          centeredSlides
          loop
          mousewheel={true}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex); // Use realIndex for loop mode
          }}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          className="w-full max-w-4xl"
        >
          {products.map((product,key) => (
            <SwiperSlide key={key} className="flex justify-center w-full h-[80vh]">
              <div className="relative p-3 text-gray-900 text-center rounded-3xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain mx-auto"
                />
                
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="mt-9 flex items-center space-x-4">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="z-10 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        
        {/* Display active slide name */}
        <div className="min-w-[200px] text-center">
          <p className="text-xl font-semibold">{products[activeIndex]?.name}</p>
          <p className="text-lg">{products[activeIndex]?.price}</p>
        </div>

        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="z-10 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Showcase;