'use client';

import React, { useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import GooglePayButton from './GooglePayButton';

interface PaymentMethodProps {
    isOpen: boolean;
    onClose: () => void;
}




const PaymentMethod: React.FC<PaymentMethodProps> = ({ isOpen, onClose }) => {
    const buttonRef = useRef<HTMLDivElement | null>(null);
    const items = useSelector((state: RootState) => state.cart.items);
    const [method, setMethod] = useState<'gpay' | 'paypal' | 'cod'>('gpay');
    const total = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0).toFixed(2);

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);
 // Only re-run this effect when `isOpen` becomes true or `total` changes

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
