'use client';

import React, { useEffect } from "react";

// Define types for payment data and error
interface PaymentData {
  paymentMethodData: {
    // Define properties based on the expected structure
    // Example: token: string;
    token: string;
    type: string;
    info: {
      cardDetails: {
        cardNumber: string;
        expirationDate: string;
        cardHolderName: string;
      };
    };
    tokenizationData: {
      token: string;
      type: string;
    };
    
  };
}

interface GooglePayError {
  code: string;
  message: string;
}

// Define the structure of the Google API
interface PaymentsClient {
  isReadyToPay(request: object): Promise<{ result: boolean }>;
  loadPaymentData(paymentData: object): Promise<PaymentData>;
  createButton(options: { onClick: () => void }): HTMLElement;
}

interface GoogleAPI {
  payments: {
    api: {
      PaymentsClient: new (options: { environment: string }) => PaymentsClient;
    };
  };
}

declare global {
  interface Window {
    google: GoogleAPI; // Use the defined interface
  }
}

interface GooglePayButtonProps {
  total: number;
  onPaymentAuthorized: (data: PaymentData) => void; // Use the specific type here
}

const GooglePayButton: React.FC<GooglePayButtonProps> = ({ total, onPaymentAuthorized }) => {
  useEffect(() => {
    if (!window.google) return;

    const paymentsClient = new window.google.payments.api.PaymentsClient({
      environment: 'TEST',
    });

    const isReadyToPayRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: "CARD",
          parameters: {
            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
            allowedCardNetworks: ["VISA", "MASTERCARD"],
          },
          tokenizationSpecification: {
            type: "PAYMENT_GATEWAY",
            parameters: {
              gateway: "stripe",
              gatewayMerchantId: process.env.NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID || 'TEST_MERCHANT_ID',
            },
          },
        },
      ],
    };

    const paymentDataRequest = {
      ...isReadyToPayRequest,
      merchantInfo: {
        merchantName: "WhitZone ",
        merchantId: process.env.NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID || 'TEST_MERCHANT_ID',
      },
      transactionInfo: {
        totalPriceStatus: "FINAL",
        totalPrice: total.toFixed(2),
        currencyCode: "INR",
        countryCode: "IN",
      },
    };

    const onGooglePayClicked = () => {
      paymentsClient.loadPaymentData(paymentDataRequest)
        .then(onPaymentAuthorized)
        .catch((err: GooglePayError) => {
          console.error("Google Pay error:", err);
          alert("Google Pay failed. Please try another payment method.");
        });
    };

    paymentsClient.isReadyToPay(isReadyToPayRequest)
      .then((res: { result: boolean }) => {
        if (res.result && !document.getElementById("gpay-button")?.hasChildNodes()) {
          const button = paymentsClient.createButton({ onClick: onGooglePayClicked });
          document.getElementById("gpay-button")?.appendChild(button);
        }
      })
      .catch(console.error);
  }, [total, onPaymentAuthorized]);

  return <div id="gpay-button" />;
};

export default GooglePayButton;
