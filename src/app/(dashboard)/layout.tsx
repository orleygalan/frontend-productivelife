"use client";

import Sidebar from "@/components/layout/Sidebar";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

    const router = useRouter();
    const { user, token } = useAuthStore();

    useEffect(() => {
        if (!token) {
            router.replace('/login');
        }
    }, [token, router]);

    if (!token || !user) return null;

    return (
        <div className="flex min-h-screen bg-[#050A18] ">
            <Sidebar />
            <main className="flex-1 md:ml-64 p-4 md:p-8">
                {children}
            </main>
        </div>
    )
}