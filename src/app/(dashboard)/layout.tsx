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
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    )
}