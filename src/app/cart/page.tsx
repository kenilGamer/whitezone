'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { removeItem, updateQuantity } from '@/redux/cartSlice';
import { RootState } from '@/redux/store';
import PaymentMethod from '@/components/cart/PaymentMethod'; // Ensure PaymentMethod is imported

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((s: RootState) => s.cart.items);
  const { data: session } = useSession();
  const [msg, setMsg] = useState('');
  const [isOpen, setOpen] = useState(false);

  const total = cartItems.reduce((t, i) => t + parseFloat(i.price) * i.quantity, 0);

  const handleRemove = (id: string) => {
    dispatch(removeItem(id));
    setMsg('Item removed from cart');
    setTimeout(() => setMsg(''), 3000);
  };

  const handleQuantityChange = (id: string, delta: number) => {
    dispatch(updateQuantity({ id, delta }));
    setMsg('Cart updated successfully');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="p-6 min-h-screen flex flex-col items-center relative" style={{ backgroundColor: "#FCFFC1" }}>
      {msg && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {msg}
        </div>
      )}
      
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 mb-5 px-4 py-2 bg-[#FB9EC6] text-white rounded-lg hover:bg-[#da004c] transition"
      >
        Back
      </button>

      <h1 className="text-4xl font-bold max-md:mt-7 mb-8 text-center" style={{ color: "#FB9EC6" }}>
        Your Shopping Cart
      </h1>

      {session ? (
        <div className="max-w-4xl w-full bg-white p-6 rounded-lg shadow-lg" style={{ backgroundColor: "#FFE893" }}>
          <ul className="space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center p-4 rounded-lg shadow-md" style={{ backgroundColor: "#FBB4A5" }}>
                  <div>
                    <h2 className="text-2xl font-semibold mb-1 text-[#fb3189]">{item.name}</h2>
                    <p className="text-gray-800">Price: <span className="font-medium">${item.price}</span></p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button onClick={() => handleQuantityChange(item.id, -1)} className="px-2 py-1 bg-[#FB9EC6] text-white rounded hover:bg-[#da004c] transition">-</button>
                      <p className="text-gray-800">Quantity: <span className="font-medium">{item.quantity}</span></p>
                      <button onClick={() => handleQuantityChange(item.id, 1)} className="px-2 py-1 bg-[#FB9EC6] text-white rounded hover:bg-[#da004c] transition">+</button>
                    </div>
                  </div>
                  <button onClick={() => handleRemove(item.id)} className="px-4 py-2 rounded-lg font-medium hover:opacity-90 transition bg-[#da004c] text-white">Remove</button>
                </li>
              ))
            ) : (
              <li className="flex justify-center items-center p-4 rounded-lg shadow-md" style={{ backgroundColor: "#FBB4A5" }}>
                <p className="text-xl font-semibold text-gray-800">Your cart is empty.</p>
              </li>
            )}
          </ul>

          <div className="mt-8 border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Total:</h2>
              <p className="text-2xl font-semibold">${total.toFixed(2)}</p>
            </div>
            <button onClick={() => setOpen(true)} className="w-full py-3 rounded-lg font-medium text-lg hover:opacity-90 transition" style={{ backgroundColor: "#FB9EC6", color: "#FFFFFF" }}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-800">Please sign in to view your cart.</p>
          <button onClick={() => signIn()} className="mt-4 px-4 py-2 bg-[#FB9EC6] text-white rounded-lg hover:bg-[#da004c] transition">Sign In</button>
        </div>
      )}

    {cartItems.length > 0 && (
      <PaymentMethod 
        isOpen={isOpen} 
        onClose={() => setOpen(false)}
        onPaymentComplete={() => {
          setOpen(false);
          setMsg('Payment processed successfully!');
          setTimeout(() => setMsg(''), 3000);
        }}
      />
    )}
    </div>
  );
}