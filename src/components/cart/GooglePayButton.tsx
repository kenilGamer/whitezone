'use client';

import React, { useEffect } from "react";

declare global {
  interface Window {
    google: any;
  }
}

interface GooglePayButtonProps {
  total: number;
  onPaymentAuthorized: (data: any) => void;
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
            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"], // Corrected to only include valid methods
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
        totalPrice: total.toFixed(2), // Ensure total is a string with two decimal places
        currencyCode: "INR",
        countryCode: "IN",
      },
    };

    const onGooglePayClicked = () => {
      paymentsClient.loadPaymentData(paymentDataRequest)
        .then(onPaymentAuthorized)
        .catch((err: any) => {
          console.error("Google Pay error:", err);
          alert("Google Pay failed. Please try another payment method.");
        });
    };

    paymentsClient.isReadyToPay(isReadyToPayRequest)
      .then((res: any) => {
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
