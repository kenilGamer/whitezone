"use client";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow, Mousewheel } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { useDispatch } from "react-redux";
import { addItem } from "@/redux/cartSlice";

interface Product {
  _id?: string;
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  showhome: boolean; // Added showhome property
}

const Showcase = () => {
  const dispatch = useDispatch();
  const swiperRef = useRef<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        // Filter products to only include those with showhome set to true
        const filteredProducts = data.filter((product: Product) => product.showhome);
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    if (!product._id) {
      console.error("Product ID is undefined. Cannot add to cart.");
      return; // Exit if the product ID is not defined
    }

    dispatch(addItem({
      id: product._id, // Ensure this is a valid string
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: 1
    }));

  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    if (hoveredIndex !== index) setHoveredIndex(index);

    requestAnimationFrame(() => {
      const imgRect = (e.target as HTMLImageElement).getBoundingClientRect();
      const x = (e.clientX - imgRect.left - imgRect.width / 2) / 10;
      const y = (e.clientY - imgRect.top - imgRect.height / 2) / 10;

      setMousePosition({ x, y });
    });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="h-[90vh] w-full flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="w-full p-2">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, Mousewheel, EffectCoverflow]}
          effect="coverflow"
          spaceBetween={0}
          slidesPerView={isMobile ? 1 : 3}
          centeredSlides
          loop
          mousewheel={true}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          coverflowEffect={{
            rotate: 50,
            stretch: 2,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          className="w-full max-w-4xl"
        >
          {products.map((product, index) => (
            <SwiperSlide
              key={product._id}
              className="flex flex-col items-center justify-center w-full h-[80vh] bg-[#eaf07f] rounded-3xl shadow-lg transition-transform duration-300 p-5"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: activeIndex === index ? 1 : 0.9, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative p-3 text-gray-900 text-center rounded-3xl"
              >
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain mx-auto transition-transform duration-200"
                  initial={{ y: 50, opacity: 0, scale: 0.9 }}
                  animate={{
                    y: hoveredIndex === index ? mousePosition.y * 1.2 : 0,
                    x: hoveredIndex === index ? mousePosition.x * 1.2 : 0,
                    rotate: hoveredIndex === index ? mousePosition.x * 0.5 : 0,
                    scale: hoveredIndex === index ? 1.05 : 1,
                    opacity: 1,
                  }}
                  transition={{ type: "spring", stiffness: 120, damping: 12, mass: 1.8 }}
                  onMouseMove={(e) => handleMouseMove(e, index)}
                  onMouseLeave={handleMouseLeave}
                />
              </motion.div>
              <div className="flex justify-center items-center ">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="px-6 py-2 bg-[#FB9EC6] text-white rounded-lg hover:bg-[#da004c] transition"
                >
                  Add to Cart
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="flex items-center space-x-4 absolute bottom-10"
      >
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="z-10 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="min-w-[200px] text-center">
          <p className="text-xl font-semibold">{products[activeIndex]?.name}</p>
          <p className="text-lg">${products[activeIndex]?.price}</p>
        </div>

        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="z-10 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Showcase;