"use client";

import { authService } from "@/lib/services/authService";
import { useAuthStore } from "@/store/authStore";
import { ClipboardList, Gift, Sprout, DoorOpen, Briefcase, BarChart, } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const workLinks = [
    { href: '/work/organizations', label: 'Organizaciones', icon: <ClipboardList /> },
];

const lifeLinks = [
    { href: '/life/goals', label: 'Mis metas', icon: <ClipboardList /> },
    { href: '/life/rewards', label: 'Recompensas', icon: <Gift /> },
    { href: '/life/history', label: 'Historial',   icon: <BarChart /> },
];

export default function Sidebar() {

    const pathname = usePathname();
    const router = useRouter();
    const { user, setUser, clearAuth } = useAuthStore();

    const isWorkMode = user?.mode === 'work';

    const handleSwitchMode = async () => {
        try {
            const newMode = isWorkMode ? 'life' : 'work';
            const update = await authService.switchMode(newMode);
            setUser(update);
            router.push(newMode === 'work' ? '/work/organizations' : '/life/goals');
        } catch (error) {
            console.error('Error al cambiar de modo', error);
        }
    }

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Error al cerrar la sesion.', error);
        } finally {
            clearAuth();
            router.push('/login');
        }
    }

    const links = isWorkMode ? workLinks : lifeLinks;

    return (
        <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 flex flex-col">
            {/* Logo */}
            <div className="px-6 py-5 border-b border-gray-100">
                <h1 className="text-lg font-bold text-gray-900">ProductiveLife</h1>
                <p className="text-xs text-gray-400 mt-0.5">Hola, {user?.name}</p>
            </div>

            {/* Switch de modo */}
            <div className="px-4 py-4 border-b border-gray-100">
                <button
                    onClick={handleSwitchMode}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isWorkMode
                        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                >
                    {isWorkMode ? (
                        <> <Briefcase /> Modo Work</>
                    ) : (
                        <><Sprout /> Modo Life</>
                    )}
                    <span className="text-xs opacity-60">Cambiar</span>
                </button>
            </div>

            {/* Navegación */}
            <nav className="flex-1 px-4 py-4 space-y-1">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${isActive
                                ? 'bg-gray-900 text-white font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <span>{link.icon}</span>
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / info del usuario y logout */}
            <div className="px-4 py-4 border-t border-gray-100">
                {user?.mode === 'life' && (
                    <div className="px-4 py-2 mb-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-green-700 font-medium">Modo Life activo</p>
                        <p className="text-xs text-green-500">Acumula puntos completando tareas</p>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                    <DoorOpen />
                    <span>Cerrar sesión</span>
                </button>
            </div>
        </aside>
    )
}