"use client";
import Navbar from "@/components/root/Navbar";
import Showcase from "@/components/root/showcase";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiShoppingCart } from "react-icons/hi2";
import { IoIosArrowUp } from "react-icons/io";
import Link from "next/link";

function Page() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setShowScrollTop(scrollTop > 300);
      
      if (!isScrolling) {
        setIsScrolling(true);
        setTimeout(() => setIsScrolling(false), 150);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolling]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="overflow-hidden select-none h-screen w-full bg-gradient-to-br from-[#FFE893] via-[#FFD6A5] to-[#FFE893]">
      <Navbar 
        onCartClick={() => window.location.href = '/cart'}
        onWishlistClick={() => window.location.href = '/wishlist'}
        onProfileClick={() => window.location.href = '/profile'}
      />
      <main className="relative overflow-hidden">
        <h1 className="text-4xl md:text-5xl font-bold text-center p-1 bg-gradient-to-r from-[#FB9EC6] to-[#ff2885] bg-clip-text text-transparent">
          Discover Our Featured Collection
        </h1>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <Showcase />
      </main>

      {/* Floating Action Buttons */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 z-50 p-3 bg-gradient-to-r from-[#FB9EC6] to-[#ff2885] text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
            aria-label="Scroll to top"
          >
            <IoIosArrowUp className="text-2xl" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Link
          href="/cart"
          className="flex items-center justify-center p-4 bg-gradient-to-r from-[#FB9EC6] to-[#ff2885] text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
          aria-label="View cart"
        >
          <HiShoppingCart className="text-2xl" />
        </Link>
      </motion.div>

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FB9EC6] to-[#ff2885] origin-left z-50"
        style={{ scaleX: isScrolling ? 1 : 0 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}

export default Page;
