"use client";

import Navbar from "@/components/root/Navbar";
import React, { useEffect, useState } from "react";
import { useLoading } from "@/context/loading-context";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaHeart, FaTrash } from "react-icons/fa";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { log } from "console";

interface Product {
  _id?: string;
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

function Page() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const { startLoading, stopLoading, updateProgress } = useLoading();
  const router = useRouter();
  const { data: session, status } = useSession();

  // Fetch wishlist items from the API
  useEffect(() => {
    const fetchWishlistItems = async () => {
      if (status === 'loading') return;
      
      if (!session?.user?._id) {
        router.push('/sign-in');
        return;
      }

      startLoading('Loading wishlist...');
      try {
        updateProgress(30);
        const response = await fetch(`/api/wishlist?userId=${session.user._id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch wishlist items");
        }
        updateProgress(60);
        const data = await response.json();
        updateProgress(90);
        setWishlistItems(data.wishlist || []);
        updateProgress(100);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Error fetching wishlist items:", error);
        toast.error('Failed to load wishlist');
        setWishlistItems([]);
      } finally {
        stopLoading();
      }
    };

    fetchWishlistItems();
  }, [session, status, startLoading, stopLoading, updateProgress, router]);

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!session?.user?._id) {
      toast.error('Please sign in to manage your wishlist');
      return;
    }

    try {
      const response = await fetch(`/api/wishlist?userId=${session.user._id}&productId=${productId}`, {
        method: 'DELETE',
      });
      console.log(response);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to remove item');
      }

      // Update the wishlist items state
      setWishlistItems(prevItems => 
        prevItems.filter(item => item.productId !== productId)
      );

      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item');
    }
  };

  const addToCart = async (product: Product) => {
    if (!session?.user?._id) {
      toast.error('Please sign in to add items to cart');
      return;
    }

    startLoading('Adding to cart...');
    try {
      // TODO: Implement add to cart functionality
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Added ${product.name} to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error('Failed to add to cart');
    } finally {
      stopLoading();
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFE893] via-[#FFD6E0] to-[#FFE893]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FB9EC6]"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFE893] via-[#FFD6E0] to-[#FFE893] flex items-center justify-center p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-6">Sign in to view and manage your wishlist</p>
          <button
            onClick={() => router.push('/sign-in')}
            className="px-6 py-3 bg-gradient-to-r from-[#FB9EC6] to-[#ff2885] text-white rounded-lg hover:from-[#ff2885] hover:to-[#FB9EC6] transition-all duration-300 transform hover:scale-105"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden w-full bg-gradient-to-br from-[#FFE893] via-[#FFD6E0] to-[#FFE893] flex flex-col">
      <Navbar 
        onCartClick={() => router.push('/cart')}
        onWishlistClick={() => router.push('/wishlist')}
        onProfileClick={() => router.push('/profile')}
      />
      <div className="flex-1 p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-y-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FB9EC6] to-[#ff2885] bg-clip-text text-transparent">
              My Wishlist
            </h1>
            <span className="px-4 py-1 bg-[#FB9EC6]/10 text-[#FB9EC6] rounded-full text-sm font-medium">
              {wishlistItems?.length || 0} items
            </span>
          </div>
        </div>

        {/* Wishlist Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {wishlistItems?.map((item, index) => (
              <motion.div
                key={item._id || item.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* Product Image Container */}
                <div className="relative overflow-hidden rounded-t-xl aspect-square bg-gray-50">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Remove from Wishlist Button */}
                  <button 
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <FaTrash className="w-5 h-5" />
                  </button>
                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-[#FB9EC6]/10 text-[#FB9EC6] rounded-full text-sm font-medium">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-[#ff2885] transition-colors line-clamp-2">
                    {item.name}
                  </h2>
                  <p className="text-2xl font-bold text-[#FB9EC6] mb-4">
                    ${item.price.toFixed(2)}
                  </p>
                  <button 
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#FB9EC6] to-[#ff2885] text-white rounded-lg hover:from-[#ff2885] hover:to-[#FB9EC6] transition-all duration-300 transform hover:scale-105"
                    onClick={() => addToCart(item)}
                  >
                    <FaShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {(!wishlistItems || wishlistItems.length === 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 text-gray-400">
              <FaHeart className="w-full h-full" />
            </div>
            <p className="text-xl text-gray-600">Your wishlist is empty</p>
            <p className="text-gray-500 mt-2">Add items to your wishlist while shopping</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Page; 