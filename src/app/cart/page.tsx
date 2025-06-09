'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { removeItem, updateQuantity } from '@/redux/cartSlice';
import { RootState } from '@/redux/store';
import PaymentMethod from '@/components/cart/PaymentMethod';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaTrash, FaMinus, FaPlus, FaArrowLeft, FaSignInAlt, FaLock } from 'react-icons/fa';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import Image from 'next/image';

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((s: RootState) => s.cart.items);
  const { data: session, status } = useSession();
  const [isOpen, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const total = cartItems.reduce((t, i) => t + parseFloat(i.price) * i.quantity, 0);
  const shipping = total > 50 ? 0 : 10;
  const finalTotal = total + shipping;

  const handleRemove = (id: string) => {
    dispatch(removeItem(id));
    toast.success('Item removed from cart', {
      description: 'The item has been removed from your cart.',
    });
  };

  const handleQuantityChange = (id: string, delta: number) => {
    dispatch(updateQuantity({ id, delta }));
    toast.success('Cart updated', {
      description: 'Your cart has been updated.',
    });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FCFFC1" }}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FB9EC6]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen flex flex-col items-center relative" style={{ backgroundColor: "#FCFFC1" }}>
      <Toaster position="top-right" richColors />
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="absolute top-4 left-4 mb-5 px-4 py-2 bg-[#FB9EC6] text-white rounded-lg hover:bg-[#da004c] transition flex items-center gap-2 shadow-lg"
      >
        <FaArrowLeft /> Back
      </motion.button>

      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold max-md:mt-7 mb-8 text-center" 
        style={{ color: "#FB9EC6" }}
      >
        Your Shopping Cart
      </motion.h1>

      {session ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full bg-white p-6 rounded-lg shadow-lg" 
          style={{ backgroundColor: "#FFE893" }}
        >
          <AnimatePresence mode="popLayout">
            {cartItems.length > 0 ? (
              <motion.ul className="space-y-4">
                {cartItems.map((item) => (
                  <motion.li
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex justify-between items-center p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    style={{ backgroundColor: "#FBB4A5" }}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-semibold mb-1 text-[#fb3189]">{item.name}</h2>
                        <p className="text-gray-800">Price: <span className="font-medium">${item.price}</span></p>
                        <div className="flex items-center space-x-3 mt-2">
                          <button 
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="p-2 bg-[#FB9EC6] text-white rounded-full hover:bg-[#da004c] transition hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus />
                          </button>
                          <p className="text-gray-800 min-w-[80px] text-center">
                            Quantity: <span className="font-medium">{item.quantity}</span>
                          </p>
                          <button 
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="p-2 bg-[#FB9EC6] text-white rounded-full hover:bg-[#da004c] transition hover:scale-110"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemove(item.id)}
                      className="ml-4 p-3 rounded-full font-medium hover:opacity-90 transition bg-[#da004c] text-white hover:scale-110"
                      aria-label="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center p-8 rounded-lg shadow-md"
                style={{ backgroundColor: "#FBB4A5" }}
              >
                <FaShoppingCart className="text-6xl text-[#FB9EC6] mb-4" />
                <p className="text-xl font-semibold text-gray-800 mb-4">Your cart is empty</p>
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-2 bg-[#FB9EC6] text-white rounded-lg hover:bg-[#da004c] transition flex items-center gap-2"
                >
                  <FaShoppingCart />
                  Continue Shopping
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {cartItems.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 border-t pt-4"
            >
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={() => setOpen(true)}
                disabled={isProcessing}
                className="w-full py-3 rounded-lg font-medium text-lg hover:opacity-90 transition flex items-center justify-center gap-2"
                style={{ backgroundColor: "#FB9EC6", color: "#FFFFFF" }}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaLock />
                    Proceed to Checkout
                  </>
                )}
              </button>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white p-8 rounded-lg shadow-lg"
          style={{ backgroundColor: "#FFE893" }}
        >
          <FaSignInAlt className="text-6xl text-[#FB9EC6] mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-800 mb-4">Please sign in to view your cart</p>
          <button 
            onClick={() => signIn()}
            className="px-6 py-3 bg-[#FB9EC6] text-white rounded-lg hover:bg-[#da004c] transition flex items-center gap-2 mx-auto"
          >
            <FaSignInAlt />
            Sign In
          </button>
        </motion.div>
      )}

      {cartItems.length > 0 && (
        <PaymentMethod 
          isOpen={isOpen} 
          onClose={() => setOpen(false)}
          onPaymentComplete={() => {
            setOpen(false);
            setIsProcessing(false);
            toast.success('Payment processed successfully!', {
              description: 'Your payment has been processed successfully!',
            });
          }}
        />
      )}
    </div>
  );
}