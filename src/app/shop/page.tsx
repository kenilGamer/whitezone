"use client";

import Navbar from "@/components/root/Navbar";
import Sidebar from "@/components/shop/Sidebar";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLoading } from "@/context/loading-context";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaHeart, FaSearch, FaFilter } from "react-icons/fa";
import Image from 'next/image';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

interface Product {
  _id?: string;
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
}

function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const { startLoading, stopLoading, updateProgress } = useLoading();

  const addToWishlist = async (product: Product) => {
    startLoading('Adding to wishlist...');
    try {
      // TODO: Replace with actual user ID from authentication
      const userId = 'current-user-id';
      
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add to wishlist');
      }

      toast.success('Added to wishlist!', {
        description: `${product.name} has been added to your wishlist.`,
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist', {
        description: error instanceof Error ? error.message : 'Please try again later.',
      });
    } finally {
      stopLoading();
    }
  };

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      startLoading('Loading products...');
      try {
        updateProgress(30);
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        updateProgress(60);
        const data = await response.json();
        updateProgress(90);
        setProducts(data.products);
        updateProgress(100);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        stopLoading();
      }
    };

    fetchProducts();
  }, [startLoading, stopLoading, updateProgress]);

  // Filter products based on the category query parameter and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !category || category === "All Products" || product.category.toLowerCase() === category.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-screen overflow-hidden w-full bg-gradient-to-br from-[#FFE893] via-[#FFD6E0] to-[#FFE893] flex flex-col">
      <Toaster position="top-right" richColors />
      <Navbar 
        onCartClick={() => window.location.href = '/cart'}
        onWishlistClick={() => window.location.href = '/wishlist'}
        onProfileClick={() => window.location.href = '/profile'}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onSearch={setSearchQuery} />
        <div className="flex-1 p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-y-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FB9EC6] to-[#ff2885] bg-clip-text text-transparent">
                {category && category !== "All Products" ? `${category} Collection` : "All Products"}
              </h1>
              <span className="px-4 py-1 bg-[#FB9EC6]/10 text-[#FB9EC6] rounded-full text-sm font-medium">
                {filteredProducts.length} items
              </span>
            </div>
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FB9EC6] focus:border-transparent transition-all duration-300"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="p-2 rounded-full bg-white border border-gray-200 hover:bg-[#FB9EC6] hover:text-white transition-colors"
              >
                <FaFilter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-white rounded-lg shadow-md mb-8"
              >
                <div className="p-4">
                  {/* Add your filter options here */}
                  <p className="text-gray-500">Filter options coming soon...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                  onMouseEnter={() => setHoveredProduct(product._id || null)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Product Image Container */}
                  <div className="relative overflow-hidden rounded-t-xl aspect-square bg-gray-50">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 flex flex-col space-y-2">
                      <button 
                        onClick={() => addToWishlist(product)} 
                        className="p-2 bg-white rounded-full shadow-md hover:bg-[#FB9EC6] hover:text-white transition-colors"
                      >
                        <FaHeart className="w-5 h-5" />
                      </button>
                    </div>
                    {/* Category Badge */}
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-[#FB9EC6]/10 text-[#FB9EC6] rounded-full text-sm font-medium">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-[#ff2885] transition-colors line-clamp-2">
                      {product.name}
                    </h2>
                    <p className="text-2xl font-bold text-[#FB9EC6] mb-4">
                      ${product.price}
                    </p>
                    <button 
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#FB9EC6] to-[#ff2885] text-white rounded-lg hover:from-[#ff2885] hover:to-[#FB9EC6] transition-all duration-300 transform hover:scale-105"
                      onClick={() => {
                        startLoading('Adding to cart...');
                        setTimeout(() => {
                          stopLoading();
                          alert('Added to cart!');
                        }, 1000);
                      }}
                    >
                      <FaShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>

                  {/* Hover Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredProduct === product._id ? 1 : 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl pointer-events-none"
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 text-gray-400">
                <FaSearch className="w-full h-full" />
              </div>
              <p className="text-xl text-gray-600">
                {searchQuery
                  ? `No products found matching "${searchQuery}"`
                  : category
                  ? `No products found in ${category} category`
                  : "No products available"}
              </p>
              <p className="text-gray-500 mt-2">Try adjusting your search or browse different categories</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;