"use client";
import { useAuthStore } from "@/store/authStore"

export default function LoadingCards() {

    const { user } = useAuthStore();

    const isWorkMode = user?.mode === 'work'

    return (
        <div className="w-full flex flex-col gap-3 p-2">
            {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="grid lg:grid-cols-2 grid-cols-1 gap-3" >
                    <div className={`h-20 ${isWorkMode ? 'bg-gray-300' : 'bg-[#463671]/30'} rounded-2xl animate-pulse shadow-sm flex justify-center items-center p-4 gap-3`}>
                        <div className="w-10 h-10 rounded-full bg-[#463671]/40 "></div>
                        <div className="w-[90%]">
                            <div className="w-full h-3 rounded-3xl bg-[#463671]/40"></div>
                            <div className="w-[50%] h-3 rounded-3xl bg-[#463671]/40 mt-1"></div>
                            <div className="w-[80%] h-3 rounded-3xl bg-[#463671]/40 mt-1"></div>

                        </div>
                    </div>
                    <div className={`h-20 ${isWorkMode ? 'bg-gray-300' : 'bg-[#463671]/30'} rounded-2xl animate-pulse shadow-sm lg:flex justify-center items-center p-4 gap-3 hidden`}>
                        <div className="w-10 h-10 rounded-full bg-[#463671]/40 "></div>
                        <div className="w-[90%]">
                            <div className="w-full h-3 rounded-3xl bg-[#463671]/40"></div>
                            <div className="w-[50%] h-3 rounded-3xl bg-[#463671]/40 mt-1"></div>
                            <div className="w-[80%] h-3 rounded-3xl bg-[#463671]/40 mt-1"></div>

                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}