"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { FaShoppingBag, FaHeart, FaEnvelope, FaEdit, FaCamera } from "react-icons/fa";
import { useLoading } from "@/context/loading-context";
import { signIn } from "next-auth/react";
import Image from 'next/image';

// Define the Order interface
interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

// Define the Saved Item interface
interface SavedItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

function Page() {
  const { data: session, status, update: updateSession } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const { startLoading, stopLoading, updateProgress } = useLoading();
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: session?.user?.username || "",
    image: session?.user?.image || "",
  });
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") {
      startLoading("Loading profile...");
    } else if (session) {
      const fetchData = async () => {
        try {
          startLoading("Loading your data...");
          updateProgress(30);

          // Fetch orders
          const ordersResponse = await fetch(`/api/orders?userId=${session.user.email}`);
          if (!ordersResponse.ok) {
            throw new Error("Failed to fetch orders");
          }
          const ordersData = await ordersResponse.json();
          setOrders(ordersData);
          updateProgress(60);

          // Fetch saved items
          const savedItemsResponse = await fetch(`/api/saved-items?userId=${session.user.email}`);
          if (!savedItemsResponse.ok) {
            throw new Error("Failed to fetch saved items");
          }
          const savedItemsData = await savedItemsResponse.json();
          setSavedItems(savedItemsData);
          updateProgress(90);

          setError(null);
          updateProgress(100);
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(error instanceof Error ? error.message : "An error occurred");
          if (retryCount < 3) {
            setRetryCount(prev => prev + 1);
            setTimeout(() => {
              fetchData();
            }, 2000); // Retry after 2 seconds
          }
        } finally {
          stopLoading();
        }
      };

      fetchData();
    } else {
      stopLoading();
    }
  }, [session, status, startLoading, stopLoading, updateProgress, retryCount]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    startLoading("Updating profile...");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      // Update session with new user data
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          username: data.user.username,
          image: data.user.image,
        },
      });

      setIsEditing(false);
      setEditError(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      setEditError(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      stopLoading();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({
          ...prev,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (status === "loading") {
    return null; // The loader will be shown by the LoadingProvider
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFE893] to-[#FFD6E0] flex items-center justify-center p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-6">Sign in to view your profile and manage your orders</p>
          <button
            onClick={() => signIn()}
            className="px-6 py-3 bg-gradient-to-r from-[#FB9EC6] to-[#ff2885] text-white rounded-lg hover:from-[#ff2885] hover:to-[#FB9EC6] transition-all duration-300 transform hover:scale-105"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFE893] to-[#FFD6E0] flex items-center justify-center p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-4">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#FB9EC6] to-[#ff2885] text-white rounded-lg hover:from-[#ff2885] hover:to-[#FB9EC6] transition-all duration-300 transform hover:scale-105"
            >
              Try Again
            </button>
            <p className="text-sm text-gray-500">
              If the problem persists, please contact support
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE893] to-[#FFD6E0] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative group">
              <div className="w-32 h-32 bg-gradient-to-br from-[#FB9EC6] to-[#ff2885] rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src={session.user?.image || '/default-avatar.png'}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaCamera className="text-white text-2xl" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            <div className="flex-1">
              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FB9EC6] focus:border-transparent"
                      required
                    />
                  </div>
                  {editError && (
                    <p className="text-red-500 text-sm">{editError}</p>
                  )}
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-[#FB9EC6] to-[#ff2885] text-white rounded-lg hover:from-[#ff2885] hover:to-[#FB9EC6] transition-all duration-300"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({
                          username: session?.user?.username || "",
                          image: session?.user?.image || "",
                        });
                        setEditError(null);
                      }}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">{session?.user?.username}</h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 text-gray-600 hover:text-[#FB9EC6] transition-colors"
                    >
                      <FaEdit className="text-xl" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaEnvelope className="text-lg" />
                    <span>{session?.user?.email}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Orders Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-8"
        >
          <div className="flex items-center space-x-2 mb-6">
            <FaShoppingBag className="w-6 h-6 text-[#FB9EC6]" />
            <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
          </div>
          
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map(order => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                      <p className="text-sm text-gray-500">Date: {new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <span className="px-3 py-1 bg-[#FB9EC6]/10 text-[#FB9EC6] rounded-full text-sm font-medium">
                      {order.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span>{item.name} x {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span className="font-medium">Total</span>
                    <span className="text-lg font-bold text-[#FB9EC6]">${order.total.toFixed(2)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No orders found.</p>
            </div>
          )}
        </motion.div>

        {/* Saved Items Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
        >
          <div className="flex items-center space-x-2 mb-6">
            <FaHeart className="w-6 h-6 text-[#FB9EC6]" />
            <h2 className="text-2xl font-bold text-gray-800">Saved Items</h2>
          </div>
          
          {savedItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedItems.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex space-x-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-[#FB9EC6] font-bold">${item.price.toFixed(2)}</p>
                      <button className="mt-2 text-sm text-red-500 hover:text-red-700 transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No saved items found.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Page;