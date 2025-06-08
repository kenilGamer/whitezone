"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { useLoading } from "@/context/loading-context";
import Image from "next/image";

interface NavbarProps {
  onCartClick: () => void;
  onWishlistClick: () => void;
  onProfileClick: () => void;
}

export default function Navbar({ onCartClick, onWishlistClick, onProfileClick }: NavbarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { startLoading } = useLoading();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleClick = (callback: () => void) => {
    startLoading('Loading...');
    callback();
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm"
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-[#FB9EC6]">
              WhiteZone
            </Link>
          </div>
          <div className="hidden md:flex items-center justify-center space-x-6">
            {session?.user?.role === 'admin' && (
              <Link href="/admin" className={`${isActive('/admin') ? 'text-[#FB9EC6]' : 'text-gray-600'} hover:text-[#FB9EC6] transition-colors`}>
                Admin
              </Link>
            )}
            <Link href="/" className={`${isActive('/') ? 'text-[#FB9EC6]' : 'text-gray-600'} hover:text-[#FB9EC6] transition-colors`}>
              Home
            </Link>
            <Link href="/shop" className={`${isActive('/shop') ? 'text-[#FB9EC6]' : 'text-gray-600'} hover:text-[#FB9EC6] transition-colors`}>
              Shop
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleClick(onWishlistClick)}
              className="p-2 text-gray-600 hover:text-[#FB9EC6] transition-colors"
            >
              <FaHeart className="w-6 h-6" />
            </button>
            <button
              onClick={() => handleClick(onCartClick)}
              className="p-2 text-gray-600 hover:text-[#FB9EC6] transition-colors"
            >
              <FaShoppingCart className="w-6 h-6" />
            </button>
            {session ? (
              <button
                onClick={() => handleClick(onProfileClick)}
                className="p-2 text-gray-600 hover:text-[#FB9EC6] transition-colors"
              >
                <Image
                  src={session.user?.image || '/default-avatar.png'}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full"
                />
              </button>
            ) : (
              <Link
                href="/signin"
                className="px-4 py-2 text-[#FB9EC6] hover:text-[#ff2885] transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </motion.div>
  );
}