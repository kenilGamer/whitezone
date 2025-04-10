'use client';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import AuthProvider from '@/context/auth-provider';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import store, { persistor } from '@/redux/store';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import Script from 'next/script';
import { useState, useEffect } from 'react';
import Loader from '@/components/Loader';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    const handleRouteChange = () => {
      handleStart();
      handleComplete();
    };

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // Simulate data fetching
      await new Promise(resolve => setTimeout(resolve, 1000));
    };

    fetchData().then(() => setLoading(false));
  }, []);

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <Script
          src="https://pay.google.com/gp/p/js/pay.js"
          strategy="beforeInteractive"
        />
      </head>
      <body cz-shortcut-listen="true" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {loading ? <Loader /> : <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AuthProvider>
              <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}>
                {children}
                <Toaster />
              </PayPalScriptProvider>
            </AuthProvider>
          </PersistGate>
        </Provider>}
      </body>
    </html>
  );
}
