"use client";
import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow, Mousewheel } from "swiper/modules";
import type { Swiper as SwiperCore } from 'swiper/types';
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { useDispatch } from "react-redux";
import { addItem } from "@/redux/cartSlice";
import { useFetch } from "@/hooks/useFetch";
import { FaShoppingCart, FaEye, FaChevronLeft, FaChevronRight, FaHeart, FaTruck, FaShieldAlt, FaUndo } from "react-icons/fa";
import Image from 'next/image';

interface Product {
  _id?: string;
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
}

const Showcase = () => {
  const dispatch = useDispatch();
  const swiperRef = useRef<SwiperCore | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  // Use the useFetch hook to fetch products
  const { data: response = { products: [] }, error } = useFetch<{ products: Product[], pagination: { total: number, page: number, limit: number, pages: number } }>("/api/products");

  useEffect(() => {
    if (response?.products) {
      setIsLoading(false);
    }
  }, [response]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        swiperRef.current?.slidePrev();
      } else if (e.key === 'ArrowRight') {
        swiperRef.current?.slideNext();
      } else if (e.key === 'Escape' && isQuickViewOpen) {
        setIsQuickViewOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQuickViewOpen]);

  // Handle touch interactions
  const handleTouchStart = (_: SwiperCore, event: PointerEvent | MouseEvent | TouchEvent) => {
    if ('touches' in event) {
      setTouchStart(event.touches[0].clientX);
    }
  };

  const handleTouchMove = (_: SwiperCore, event: PointerEvent | MouseEvent | TouchEvent) => {
    if ('touches' in event) {
      setTouchEnd(event.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      swiperRef.current?.slideNext();
    } else if (isRightSwipe) {
      swiperRef.current?.slidePrev();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAddToCart = async (product: Product) => {
    if (!product._id) {
      console.error("Product ID is undefined. Cannot add to cart.");
      return;
    }

    setIsAddingToCart(true);
    try {
      dispatch(addItem({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: 1
      }));
      setShowAddedToCart(true);
      setTimeout(() => setShowAddedToCart(false), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

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

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    // Here you would typically dispatch an action to update the wishlist in your store
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-[90vh]">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">Error loading products: {error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Retry loading products"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-[90vh] w-full flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl p-2">
          <div className="animate-pulse flex space-x-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 h-[80vh] bg-gray-200 rounded-3xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!response?.products || response.products.length === 0) {
    return (
      <div className="flex items-center justify-center h-[90vh]">
        <div className="text-center">
          <p className="text-gray-500 text-xl mb-4">No products available</p>
          <p className="text-gray-400">Check back later for new products</p>
        </div>
      </div>
    );
  }

  const activeProduct = response.products[activeIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="h-[90vh] w-full flex flex-col items-center justify-center overflow-hidden relative bg-gradient-to-b from-white to-gray-50"
      role="region"
      aria-label="Product Showcase"
    >
      {/* Added to Cart Notification */}
      <AnimatePresence>
        {showAddedToCart && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2"
            role="alert"
          >
            <FaShoppingCart className="w-5 h-5" />
            <span>Added to cart successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full p-2">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, Mousewheel, EffectCoverflow]}
          effect="coverflow"
          spaceBetween={0}
          slidesPerView={isMobile ? 1 : 3}
          centeredSlides
          loop={response?.products?.length > 3}
          mousewheel={!isMobile}
          touchRatio={1.5}
          touchAngle={45}
          resistance={true}
          resistanceRatio={0.85}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          coverflowEffect={{
            rotate: isMobile ? 30 : 50,
            stretch: isMobile ? 1 : 2,
            depth: isMobile ? 50 : 100,
            modifier: 1,
            slideShadows: false,
          }}
          className="w-full max-w-4xl"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          a11y={{
            prevSlideMessage: 'Previous product',
            nextSlideMessage: 'Next product',
            firstSlideMessage: 'This is the first product',
            lastSlideMessage: 'This is the last product',
          }}
        >
          {response?.products?.map((product, index) => (
            <SwiperSlide
              key={product._id}
              className="flex flex-col items-center justify-center w-full h-[80vh] bg-gradient-to-br from-[#eaf07f] to-[#f0f7b5] rounded-3xl shadow-lg transition-all duration-300 hover:shadow-2xl p-5 relative overflow-hidden group"
              role="article"
              aria-label={`Product: ${product.name}`}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: activeIndex === index ? 1 : 0.9, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative p-3 text-gray-900 text-center rounded-3xl"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#FB9EC6]/10 to-[#da004c]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain mx-auto transition-all duration-300 cursor-pointer hover:scale-105 relative z-10"
                  initial={{ y: 50, opacity: 0, scale: 0.9 }}
                  animate={{
                    y: !isMobile && hoveredIndex === index ? mousePosition.y * 1.2 : 0,
                    x: !isMobile && hoveredIndex === index ? mousePosition.x * 1.2 : 0,
                    rotate: !isMobile && hoveredIndex === index ? mousePosition.x * 0.5 : 0,
                    scale: hoveredIndex === index ? 1.05 : 1,
                    opacity: 1,
                  }}
                  transition={{ type: "spring", stiffness: 120, damping: 12, mass: 1.8 }}
                  onMouseMove={!isMobile ? (e) => handleMouseMove(e, index) : undefined}
                  onMouseLeave={!isMobile ? handleMouseLeave : undefined}
                  onClick={() => setIsQuickViewOpen(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setIsQuickViewOpen(true);
                    }
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute -bottom-5 left-0 right-0 p-4 bg-gradient-to-t from-black/20 to-transparent rounded-b-3xl"
                >
                  <h3 className="text-lg font-semibold text-white drop-shadow-lg">
                    {product.name}
                  </h3>
                  <p className="text-white/90 text-sm drop-shadow-lg mt-10">
                    ${product.price}
                  </p>
                </motion.div>
              </motion.div>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-4 relative z-20">
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(251, 158, 198, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddToCart(product)}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#FB9EC6] to-[#da004c] text-white rounded-lg transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isAddingToCart}
                  aria-label={`Add ${product.name} to cart`}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#FB9EC6]/20 to-[#da004c]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <FaShoppingCart className="w-5 h-5 mr-2 relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium relative z-10 transform group-hover:translate-x-1 transition-transform duration-300">
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsQuickViewOpen(true)}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-lg transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg relative overflow-hidden group"
                  aria-label={`Quick view ${product.name}`}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-gray-700/20 to-gray-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <FaEye className="w-5 h-5 mr-2 relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium relative z-10 transform group-hover:translate-x-1 transition-transform duration-300">Quick View</span>
                </motion.button>
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
        <motion.button
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)"
          }}
          whileTap={{ scale: 0.9 }}
          onClick={() => swiperRef.current?.slidePrev()}
          className="z-10 bg-gradient-to-r from-gray-900 to-gray-800 text-white p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
          aria-label="Previous product"
        >
          <motion.div
            className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-gray-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
          <FaChevronLeft className="w-6 h-6 relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-w-[200px] text-center bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100 relative overflow-hidden group"
          role="status"
          aria-live="polite"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#FB9EC6]/5 to-[#da004c]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2 relative z-10"
          >
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-bold text-gray-800 tracking-tight transform group-hover:translate-x-1 transition-transform duration-300"
            >
              {activeProduct?.name}
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold bg-gradient-to-r from-[#FB9EC6] to-[#da004c] bg-clip-text text-transparent transform group-hover:scale-105 transition-transform duration-300"
            >
              ${activeProduct?.price}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-3 py-1 bg-gradient-to-r from-[#FB9EC6]/10 to-[#da004c]/10 rounded-full transform group-hover:scale-105 transition-transform duration-300"
            >
              <span className="text-sm font-medium bg-gradient-to-r from-[#FB9EC6] to-[#da004c] bg-clip-text text-transparent">
                {activeProduct?.category}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.button
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)"
          }}
          whileTap={{ scale: 0.9 }}
          onClick={() => swiperRef.current?.slideNext()}
          className="z-10 bg-gradient-to-r from-gray-900 to-gray-800 text-white p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
          aria-label="Next product"
        >
          <motion.div
            className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-gray-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
          <FaChevronRight className="w-6 h-6 relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
        </motion.button>
      </motion.div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {isQuickViewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsQuickViewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 sm:p-6 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-100"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-2"
                >
                  <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                    {activeProduct?.name}
                  </h2>
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-[#FB9EC6]/10 rounded-full text-sm font-medium text-[#FB9EC6]">
                      {activeProduct?.category}
                    </span>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center space-x-1 text-yellow-400"
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm text-gray-500 ml-1">(4.8)</span>
                    </motion.div>
                  </div>
                </motion.div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleWishlistToggle}
                    className={`p-2 rounded-full transition-colors duration-300 ${
                      isWishlisted ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <FaHeart className="w-6 h-6" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsQuickViewOpen(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-300 p-2 hover:bg-gray-100 rounded-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="relative group">
                    <motion.div className="relative w-full h-[400px]">
                      <Image
                        src={activeProduct?.image || '/placeholder.png'}
                        alt={activeProduct?.name || 'Product image'}
                        fill
                        className="rounded-lg object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg pointer-events-none"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedImage(index - 1)}
                        className={`relative h-20 rounded-lg overflow-hidden cursor-pointer ${
                          selectedImage === index - 1 ? 'ring-2 ring-[#FB9EC6]' : ''
                        }`}
                      >
                        <Image
                          src={activeProduct?.image || '/placeholder.png'}
                          alt={`${activeProduct?.name} view ${index}`}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <h3 className="text-sm font-medium text-gray-500">Price</h3>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-4xl font-bold text-[#FB9EC6]">
                        ${activeProduct?.price}
                      </p>
                      <span className="text-sm text-gray-500 line-through">${(parseFloat(activeProduct?.price || '0') * 1.2).toFixed(2)}</span>
                      <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded">20% OFF</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                  >
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Experience the perfect blend of style and comfort with this premium product. 
                      Crafted with attention to detail and made from high-quality materials.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                  >
                    <h3 className="text-sm font-medium text-gray-500">Features</h3>
                    <ul className="space-y-2">
                      {[
                        'Premium quality materials',
                        'Comfortable fit',
                        'Easy to maintain',
                        'Durable construction'
                      ].map((feature, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="flex items-center space-x-2 text-gray-600"
                        >
                          <svg className="w-5 h-5 text-[#FB9EC6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleAddToCart(activeProduct);
                          setIsQuickViewOpen(false);
                        }}
                        className="flex-1 px-6 py-4 bg-[#FB9EC6] text-white rounded-lg hover:bg-[#da004c] transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg space-x-2"
                      >
                        <FaShoppingCart className="w-5 h-5" />
                        <span className="font-medium">Add to Cart</span>
                      </motion.button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <FaTruck className="w-5 h-5 text-[#FB9EC6]" />
                        <div>
                          <p className="text-sm font-medium">Free Shipping</p>
                          <p className="text-xs text-gray-500">On orders over $50</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <FaShieldAlt className="w-5 h-5 text-[#FB9EC6]" />
                        <div>
                          <p className="text-sm font-medium">Secure Payment</p>
                          <p className="text-xs text-gray-500">100% Protected</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <FaUndo className="w-5 h-5 text-[#FB9EC6]" />
                        <div>
                          <p className="text-sm font-medium">Easy Returns</p>
                          <p className="text-xs text-gray-500">30 Day Returns</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Showcase;
