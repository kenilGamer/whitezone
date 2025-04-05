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
import Script from 'next/script'; // ✅ Add this

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        {/* ✅ Google Pay script in head */}
        <Script
          src="https://pay.google.com/gp/p/js/pay.js"
          strategy="beforeInteractive"
        />
      </head>
      <body cz-shortcut-listen="true" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AuthProvider>
              <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}>
                {children}
                <Toaster />
              </PayPalScriptProvider>
            </AuthProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
