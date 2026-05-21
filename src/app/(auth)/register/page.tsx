"use client";

import { authService } from "@/lib/services/authService";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {

    const router = useRouter();
    const setAuth = useAuthStore((s) => s.setAuth);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        try {
            const data = await authService.register(form);
            setAuth(data.user, data.token);
            router.push('./life/daily-tasks');
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const responseErrors = error.response?.data?.errors as Record<string, string[] | undefined>;

                if (responseErrors) {
                    // Esperamos errores de validacion por campos
                    const mapped: Record<string, string> = {};

                    Object.entries(responseErrors).forEach(([Key, val]) => {
                        mapped[Key] = val?.[0] ?? '';
                    });
                    setErrors(mapped);
                } else {
                    setErrors({ general: error.response?.data?.message || 'Error al registrarse.' })
                }
            } else {
                setErrors({ general: 'error al registrarse.' });
            }
        }
    }

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Crea tu cuenta</h1>
                <p className="text-gray-500 text-sm mt-1">Empieza a ser más productivo hoy</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Tu nombre"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

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
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
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
                            placeholder="Mínimo 8 caracteres"
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
                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmar contraseña
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="password_confirmation"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            required
                            placeholder="Repite tu contraseña"
                            className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {errors.general && (
                    <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">
                        {errors.general}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
                >
                    {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                    Inicia sesión
                </Link>
            </p>
        </div>
    )
}