"use client";

import { authService } from "@/lib/services/authService";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore((s) => s.setAuth);

    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('submit ejecutado');
        setError('');
        setLoading(true);
        try {
            const data = await authService.login(form);
            setAuth(data.user, data.token);
            router.push(data.user.mode === 'work' ? '/work/organizations' : '/life/daily-tasks')
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'Credenciales incorrectas.');
            } else {
                setError('Credenciales incorrectas.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Bienvenido de nuevo</h1>
                <p className="text-gray-500 text-sm mt-1">Inicia sesión en ProductiveLife</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correo electrónico
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="tu@email.com"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            placeholder="********"
                            className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {error && (
                    <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
                >
                    {loading ? 'Entrando...' : 'Iniciar sesión'}
                </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
                ¿No tienes cuenta?{' '}
                <Link href="/register" className="text-blue-600 hover:underline font-medium">
                    Regístrate
                </Link>
            </p>
        </div>
    )
}