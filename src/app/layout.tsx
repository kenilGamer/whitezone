'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import AuthProvider from '@/context/auth-provider';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import store, { persistor } from '@/redux/store';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import Script from 'next/script';
import { LoadingProvider } from '@/context/loading-context';
import Loader from '@/components/Loader';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="payment-manifest" href="/payment-manifest.json" />
        <meta name="theme-color" content="#FB9EC6" />
        <Script
          src="https://pay.google.com/gp/p/js/pay.js"
          strategy="beforeInteractive"
        />
      </head>
      <body cz-shortcut-listen="true" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <LoadingProvider>
              <AuthProvider>
                <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}>
                  {children}
                  <Loader />
                  <Toaster />
                </PayPalScriptProvider>
              </AuthProvider>
            </LoadingProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
