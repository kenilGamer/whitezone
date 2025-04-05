"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router'; // Import useRouter for navigation

// Define the Order interface
interface Order {
  id: string;
  date: string;
  total: number;
}

// Define the Saved Item interface
interface SavedItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

function Page() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      // Fetch user's order history from the API
      const fetchOrders = async () => {
        try {
          const response = await fetch(`/api/orders?userId=${session.user.email}`);
          if (!response.ok) {
            throw new Error("Failed to fetch orders");
          }
          const data = await response.json();
          setOrders(data);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };

      // Fetch saved items from the API
      const fetchSavedItems = async () => {
        try {
          const response = await fetch(`/api/saved-items?userId=${session.user.email}`);
          if (!response.ok) {
            throw new Error("Failed to fetch saved items");
          }
          const data = await response.json();
          setSavedItems(data);
        } catch (error) {
          console.error("Error fetching saved items:", error);
        }
      };

      fetchOrders();
      fetchSavedItems();
      setLoading(false);
    }
  }, [session]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
      {session ? (
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-blue-600 text-center">Profile</h1>
          <div className="flex flex-col items-center mt-4">
            <img
              src={session.user.image || '/defaultProfile.png'} // Use a default image if none is provided
              alt="profile"
              className="w-[150px] h-[150px] rounded-full object-cover bg-transparent border-2 border-white"
            />
            <h2 className="text-2xl mt-3 font-semibold">{session.user.name}</h2>
            <p className="text-gray-600">{session.user.email}</p>
          </div>

          <h2 className="mt-6 text-2xl font-semibold">Order History</h2>
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length > 0 ? (
            <ul className="mt-4">
              {orders.map(order => (
                <li key={order.id} className="border-b py-2">
                  <p>Order ID: {order.id}</p>
                  <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                  <p>Total: ${order.total.toFixed(2)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-gray-600">No orders found.</p>
          )}

          <h2 className="mt-6 text-2xl font-semibold">Saved Items</h2>
          {loading ? (
            <p>Loading saved items...</p>
          ) : savedItems.length > 0 ? (
            <ul className="mt-4">
              {savedItems.map(item => (
                <li key={item.id} className="border-b py-2 flex items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p>${item.price.toFixed(2)}</p>
                  </div>
                  <button className="text-red-500 hover:text-red-700">Remove</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-gray-600">No saved items found.</p>
          )}
        </div>
      ) : (
        <p className="text-lg text-gray-600">Please sign in to view your profile.</p>
      )}
    </div>
  );
}

export default Page;