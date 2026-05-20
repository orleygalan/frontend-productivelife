"use client";

import { useAuthStore } from "@/store/authStore";
import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {

    // console.log('Modal render:', { isOpen, title });

    const { user } = useAuthStore();

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

    const isWorkMode = user?.mode === 'work';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#463671]/30 backdrop-blur-lg ">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />
            <div className={`relative ${isWorkMode ? 'bg-white' : 'bg-[#463671]/50'} rounded-2xl shadow-md w-full max-w-md mx-4 p-6 max-h-[95vh] overflow-auto `}>
                <div className="flex items-center justify-between mb-5">
                    <h2 className={`text-lg font-semibold ${isWorkMode ? 'text-black' : 'text-white'}`}>{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-purple-200 hover:text-gray-600 transition-colors text-xl leading-none"
                    >
                        <X size={16} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}