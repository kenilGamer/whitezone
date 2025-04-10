'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import GooglePayButton from './GooglePayButton';

interface PaymentMethodProps {
    isOpen: boolean;
    onClose: () => void;
}

interface PaymentData {
    paymentMethodDetails: any;
}

interface ErrorDetails {
    statusCode: string;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ isOpen, onClose }) => {
    const buttonRef = useRef<HTMLDivElement | null>(null);
    const items = useSelector((state: RootState) => state.cart.items);
    const [method, setMethod] = useState<'gpay' | 'paypal' | 'cod'>('gpay');
    const total = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0).toFixed(2);

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    useEffect(() => {
        if (!isOpen || !window.google) return;

        console.log("PaymentMethod isOpen:", isOpen);

        const paymentsClient = new window.google.payments.api.PaymentsClient({
            environment: 'TEST',
        });

        // Check if createPaymentDataRequest is a function
        if (typeof paymentsClient.createPaymentDataRequest !== 'function') {
            console.error('createPaymentDataRequest is not a function on paymentsClient');
            return;
        }

        const paymentRequest = paymentsClient.createPaymentDataRequest({
            apiVersion: 2,
            apiVersionMinor: 0,
            merchantInfo: {
                merchantId: process.env.NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID!,
                merchantName: 'Your Shop Name',
            },
            allowedPaymentMethods: [
                {
                    type: 'CARD',
                    parameters: {
                        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                        allowedCardNetworks: ['MASTERCARD', 'VISA'],
                    },
                    tokenizationSpecification: {
                        type: 'PAYMENT_GATEWAY',
                        parameters: {
                            gateway: 'example',
                            gatewayMerchantId: 'exampleGatewayMerchantId',
                        },
                    },
                },
            ],
            transactionInfo: {
                totalPriceStatus: 'FINAL',
                totalPrice: total, // Use the total calculated from the cart
                currencyCode: 'INR',
                countryCode: 'IN',
            },
        });

        paymentsClient.isReadyToPay({ allowedPaymentMethods: paymentRequest.allowedPaymentMethods })
            .then((response: { result: boolean }) => {
                if (response.result) {
                    const button = paymentsClient.createButton({
                        onClick: () => {
                            paymentsClient.loadPaymentData(paymentRequest)
                                .then((paymentData: PaymentData) => {
                                    console.log('Payment Success:', paymentData);
                                    alert('Payment Successful!');
                                    handleClose();
                                })
                                .catch((err: ErrorDetails) => {
                                    console.error('Payment Failed:', err);
                                    alert('Payment Failed: ' + err.statusCode);
                                });
                        },
                    });

                    if (buttonRef.current) {
                        buttonRef.current.innerHTML = ''; // Clear previous button
                        buttonRef.current.appendChild(button); // Insert new one
                    }
                }
            })
            .catch((err: unknown) => {
                console.error('Error checking isReadyToPay:', err);
            });
    }, [isOpen, total, handleClose]); // Only re-run this effect when `isOpen` becomes true or `total` changes

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
                    <button
                        onClick={handleClose}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg font-bold"
                    >
                        ×
                    </button>
                    <h2 className="text-2xl font-semibold mb-4 text-center text-[#FB9EC6]">Choose Payment Method</h2>
                    <div ref={buttonRef} className="flex justify-center" />

                    {/* Tabs */}
                    <div className="flex justify-around mb-6">
                        {(['gpay', 'paypal', 'cod'] as const).map((m) => (
                            <button
                                key={m}
                                onClick={() => setMethod(m)}
                                className={`px-4 py-2 rounded ${method === m ? 'bg-[#FB9EC6] text-white' : 'bg-gray-200'
                                    }`}
                            >
                                {m === 'gpay'
                                    ? 'Google Pay'
                                    : m === 'paypal'
                                        ? 'PayPal'
                                        : 'Cash on Delivery'}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    {method === 'gpay' && (
                        <div className="flex justify-center">
                            <GooglePayButton
                                total={parseFloat(total)}
                                onPaymentAuthorized={(data) => {
                                    // TODO: call your order API with paymentMethod='gpay'
                                    console.log('GPay paymentData', data);
                                    alert('Google Pay successful!');
                                    handleClose();
                                }}
                            />
                        </div>
                    )}
                    {/* End of Selection */}
                </div>
            </div>
        </>
    );
};

export default PaymentMethod;
