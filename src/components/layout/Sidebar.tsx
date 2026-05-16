"use client";

import { authService } from "@/lib/services/authService";
import { useAuthStore } from "@/store/authStore";
import { ClipboardList, Gift, Sprout, DoorOpen, Briefcase, BarChart, Menu, X, ChevronRight, PanelLeft, ChevronLeft, } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const workLinks = [
    { href: '/work/organizations', label: 'Organizaciones', icon: <ClipboardList /> },
];

const lifeLinks = [
    { href: '/life/goals', label: 'Mis metas', icon: <ClipboardList /> },
    { href: '/life/rewards', label: 'Recompensas', icon: <Gift /> },
    { href: '/life/history', label: 'Historial', icon: <BarChart /> },
];

export default function Sidebar() {

    const pathname = usePathname();
    const router = useRouter();
    const { user, setUser, clearAuth } = useAuthStore();
    // Desktop: colapsado o expandido
    const [collapsed, setCollapsed] = useState(false);
    // Mobile: abierto o cerrado
    const [mobileOpen, setMobileOpen] = useState(false);

    const isWorkMode = user?.mode === 'work';
    const links = isWorkMode ? workLinks : lifeLinks;

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

    return (
        <>
            {/* Boton toggle Mobile / solo visible en mobile */}
            <button
                onClick={() => setMobileOpen(prev => !prev)}
                className={`fixed top-6 z-50 md:hidden bg-[#463671] text-white w-6 h-10 rounded-r-lg flex items-center justify-center transition-all duration-300 ease-in-out shadow-lg ${mobileOpen ? 'left-64' : 'left-0'}`}
                aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
                {mobileOpen
                    ? <ChevronLeft size={14} />
                    : <ChevronRight size={14} />
                }
            </button>

            {/*  Overlay oscuro Mobile */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar*/}
            <aside className={`fixed top-0 left-0 z-40 h-full bg-[#030610] flex flex-col transition-all duration-300 ease-in-out ${collapsed ? 'w-16' : 'w-64'} ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full'} md:translate-x-0`}>

                {/* Header: Logo + boton collapse (desktop) */}
                <div className={`flex items-center border-b border-white/10 h-16 shrink-0 ${collapsed ? 'justify-center px-2' : 'justify-between px-5'
                    }`}>
                    {!collapsed && (
                        <div>
                            <h1 className="text-base font-bold text-white leading-tight">
                                ProductiveLife
                            </h1>
                            <p className="text-xs text-gray-400">{user?.name}</p>
                        </div>
                    )}

                    {/* Botón collapse - solo desktop */}
                    <button
                        onClick={() => setCollapsed(prev => !prev)}
                        className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                        aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
                    >
                        <PanelLeft className="w-5 h-5" />
                    </button>
                </div>

                {/* Switch de modo */}
                <div className={`border-b border-white/10 py-3 ${collapsed ? 'px-2' : 'px-4'}`}>
                    <button
                        onClick={handleSwitchMode}
                        title={collapsed ? (isWorkMode ? 'Modo Work — Cambiar' : 'Modo Life — Cambiar') : ''}
                        className={`w-full flex items-center rounded-lg text-sm font-medium transition-colors ${collapsed ? 'justify-center p-2' : 'justify-between px-4 py-2.5'
                            } ${isWorkMode
                                ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                                : 'bg-[#463671]/30 text-purple-300 hover:bg-[#463671]/50'
                            }`}
                    >
                        <span className={`flex items-center ${collapsed ? '' : 'gap-2'}`}>
                            {isWorkMode
                                ? <Briefcase size={16} />
                                : <Sprout size={16} />
                            }
                            {!collapsed && (
                                <span>{isWorkMode ? 'Modo Work' : 'Modo Life'}</span>
                            )}
                        </span>
                        {!collapsed && (
                            <span className="flex items-center gap-1 text-xs opacity-60">
                                Cambiar <ChevronRight size={12} />
                            </span>
                        )}
                    </button>
                </div>

                {/* Navegación */}
                <nav className={`flex-1 py-4 space-y-1 overflow-y-auto ${collapsed ? 'px-2' : 'px-4'}`}>
                    {links.map(({ href, label, icon }) => {
                        const isActive = pathname === href || pathname.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMobileOpen(false)}
                                title={collapsed ? label : ''}
                                className={`flex items-center rounded-lg text-sm transition-colors ${collapsed ? 'justify-center p-2.5' : 'gap-3 px-4 py-2.5'
                                    } ${isActive
                                        ? 'bg-[#0a1543] text-white font-medium border border-white/10'
                                        : 'text-[#CBD5E1]/70 hover:bg-[#080F1F] hover:text-white'
                                    }`}
                            >
                                {icon}
                                {!collapsed && <span>{label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className={`border-t border-white/10 py-4 space-y-2 ${collapsed ? 'px-2' : 'px-4'}`}>
                    {user?.mode === 'life' && !collapsed && (
                        <div className="px-4 py-3 bg-[#463671]/40 rounded-lg border border-[#463671]/60">
                            <p className="text-xs text-white font-medium">
                                Modo Life activo
                            </p>
                            <p className="text-xs text-white/60 mt-0.5">
                                Acumula puntos completando tus metas
                            </p>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        title={collapsed ? 'Cerrar sesión' : ''}
                        className={`w-full flex items-center rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors ${collapsed ? 'justify-center p-2.5' : 'gap-3 px-4 py-2.5'
                            }`}
                    >
                        <DoorOpen size={18} />
                        {!collapsed && <span>Cerrar sesión</span>}
                    </button>
                </div>
            </aside>
        </>
    )
}