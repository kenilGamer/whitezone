'use client';

import React, { useRef, useEffect, useState } from 'react';
import { FaCreditCard, FaPaypal } from 'react-icons/fa';

interface PaymentMethodProps {
    isOpen: boolean;
    onClose: () => void;
    onPaymentComplete?: () => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ isOpen, onClose, onPaymentComplete }) => {
    const buttonRef = useRef<HTMLDivElement>(null);
    const [selectedMethod, setSelectedMethod] = useState<'card' | 'paypal'>('card');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handlePayment = async (paymentType: 'card' | 'paypal') => {
        try {
            setSelectedMethod(paymentType);
            // Implement payment logic here
            console.log(`Processing ${paymentType} payment...`);
            if (onPaymentComplete) {
                onPaymentComplete();
            }
        } catch (error) {
            console.error('Payment failed:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div ref={buttonRef} className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Select Payment Method</h2>
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Payment Method</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handlePayment('card')}
                            className={`flex items-center justify-center space-x-2 p-4 border rounded-lg transition-colors ${
                                selectedMethod === 'card' 
                                    ? 'border-[#FB9EC6] bg-[#FB9EC6]/5' 
                                    : 'border-gray-200 hover:border-[#FB9EC6] hover:bg-[#FB9EC6]/5'
                            }`}
                        >
                            <FaCreditCard className="w-6 h-6 text-[#FB9EC6]" />
                            <span>Credit Card</span>
                        </button>
                        <button
                            onClick={() => handlePayment('paypal')}
                            className={`flex items-center justify-center space-x-2 p-4 border rounded-lg transition-colors ${
                                selectedMethod === 'paypal' 
                                    ? 'border-[#FB9EC6] bg-[#FB9EC6]/5' 
                                    : 'border-gray-200 hover:border-[#FB9EC6] hover:bg-[#FB9EC6]/5'
                            }`}
                        >
                            <FaPaypal className="w-6 h-6 text-[#FB9EC6]" />
                            <span>PayPal</span>
                        </button>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handlePayment(selectedMethod)}
                        className="px-4 py-2 bg-[#FB9EC6] text-white rounded hover:bg-[#ff2885]"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethod;
