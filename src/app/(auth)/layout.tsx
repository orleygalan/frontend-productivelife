"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({ children, }: { children: React.ReactNode; }) {

    const router = useRouter();
    const { token, user } = useAuthStore();

    useEffect(() => {
        if (token && user) {
            router.replace(user.mode === 'work' ? '/work/organizations' : '/life/goals');
        }
    }, [token, user, router]);

    if (token && user) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            {children}
        </div>
    )
}