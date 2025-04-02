"use client";

import Navbar from "@/components/root/Navbar";
import Sidebar from "@/components/shop/Sidebar";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const category = searchParams.get("category"); 

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data); // Set the fetched products in state
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on the category query parameter and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !category || category === "All Products" || product.category.toLowerCase() === category.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-screen w-full bg-[#FFE893] flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar onSearch={setSearchQuery} />

        {/* Product Grid */}
        <div className="flex-1 p-6 bg-white rounded-lg shadow-lg overflow-y-auto">
          {/* Header */}
          <h1 className="text-3xl font-bold text-[#FB9EC6] mb-6">
            {category && category !== "All Products" ? `${category} Collection` : "All Products"}
          </h1>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id} // Use `_id` from MongoDB
                className="bg-[#FBB4A5] p-4 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-contain mb-4 rounded-lg"
                />
                <h2 className="text-xl font-semibold text-[#ff2885]">{product.name}</h2>
                <p className="text-gray-800 font-medium">{product.price}</p>
                <button className="mt-4 px-4 py-2 bg-[#FB9EC6] text-white rounded-lg hover:bg-[#da004c] transition">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;