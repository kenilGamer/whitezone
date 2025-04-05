'use client';

import React, { useEffect } from "react";

// Extend the Window interface to include google
declare global {
  interface Window {
    google: {
      payments: {
        api: {
          PaymentsClient: new (options: { environment: string }) => {
            isReadyToPay: (request: any) => Promise<{ result: boolean }>;
            createButton: (options: { onClick: () => void }) => HTMLElement;
            loadPaymentData: (request: any) => Promise<any>;
            createPaymentDataRequest: (request: any) => any;
          };
        };
      };
    };
  }
}

interface GooglePayButtonProps {
  total: number;
  onPaymentAuthorized: (data: any) => void;
}

const GooglePayButton: React.FC<GooglePayButtonProps> = ({ total, onPaymentAuthorized }) => {
  useEffect(() => {
    const paymentsClient = new window.google.payments.api.PaymentsClient({
      environment: "TEST", // Change to "PRODUCTION" when live
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
        },
      ],
    };

    paymentsClient
      .isReadyToPay(isReadyToPayRequest)
      .then(function (response: any) {
        if (response.result) {
          const button = paymentsClient.createButton({
            onClick: onGooglePayClicked,
          });
          document.getElementById("gpay-button")?.appendChild(button);
        }
      })
      .catch(function (err: any) {
        console.error("Google Pay setup error", err);
      });

    const onGooglePayClicked = () => {
      const paymentDataRequest = {
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
                gateway: "example", // Change this to your actual gateway
                gatewayMerchantId: "exampleMerchantId",
              },
            },
          },
        ],
        merchantInfo: {
          merchantId: "01234567890123456789", // Optional in TEST mode
          merchantName: "My Store",
        },
        transactionInfo: {
          totalPriceStatus: "FINAL",
          totalPriceLabel: "Total",
          totalPrice: total.toString(),
          currencyCode: "USD",
          countryCode: "US",
        },
      };

      paymentsClient.loadPaymentData(paymentDataRequest).then(function (paymentData: any) {
        console.log("Payment success", paymentData);
        onPaymentAuthorized(paymentData);
      }).catch(function (err: any) {
        console.error("Payment failed", err);
      });
    };
  }, [total, onPaymentAuthorized]);

  return <div id="gpay-button" />;
};

export default GooglePayButton;
