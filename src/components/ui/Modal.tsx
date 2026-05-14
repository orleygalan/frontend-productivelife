"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {

    console.log('Modal render:', { isOpen, title });

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
                console.log('Escape pressed, closing modal');
            }
        }
        if (isOpen) {
            document.addEventListener('keydown', handleKey);
        }

        return () => {
            document.removeEventListener('keydown', handleKey);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 max-h-[95vh] overflow-auto ">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
                    >
                        <X size={16} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}