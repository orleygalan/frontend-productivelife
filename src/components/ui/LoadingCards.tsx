"use client";
import { useAuthStore } from "@/store/authStore"

export default function LoadingCards() {

    const { user } = useAuthStore();

    const isWorkMode = user?.mode === 'work'

    return (
        <div className="w-full h-screen flex flex-col gap-3 p-2">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`flex-1 ${isWorkMode ? 'bg-gray-300' : 'bg-[#463671]/30'} rounded-2xl animate-pulse shadow-sm`} />
            ))}
        </div>
    )
}