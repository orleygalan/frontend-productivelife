"use client";

import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const features = [
  {
    icon: '💼',
    title: 'Modo Work',
    description:
      'Organiza tu equipo en organizaciones, equipos y proyectos. Gestiona tareas con un tablero Kanban intuitivo.',
  },
  {
    icon: '🌱',
    title: 'Modo Life',
    description:
      'Crea tareas diarias, acumula puntos XP y canjea recompensas cada domingo. Mantén tu racha activa.',
  },
  {
    icon: '⭐',
    title: 'Sistema de puntos',
    description:
      'Gana XP completando tareas, sube de nivel y mantén una racha de días consecutivos productivos.',
  },
  {
    icon: '🎁',
    title: 'Recompensas',
    description:
      'Define tus propias recompensas y canjéalas con los puntos acumulados durante la semana.',
  },
  {
    icon: '👥',
    title: 'Trabajo en equipo',
    description:
      'Invita a tu equipo, asigna roles y colabora en proyectos con visibilidad total del progreso.',
  },
  {
    icon: '📊',
    title: 'Seguimiento semanal',
    description:
      'Revisa tu progreso semanal, tu historial de puntos y mantén el control de tu productividad.',
  },
];

export default function Home() {

  const router = useRouter();
  const { token, user } = useAuthStore();

  useEffect(() => {
    if (token && user) {
      router.replace(user.mode === 'work' ? '/work/organizations' : '/life/goals');
    }
  }, [token, user, router]);

  if (token && user) return null;

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-lg">ProductiveLife</span>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs font-medium bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full mb-6">
            Productividad personal y en equipo
          </span>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
            Tu vida y tu trabajo,{' '}
            <span className="text-blue-600">organizados en un solo lugar</span>
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
            ProductiveLife combina gestión de proyectos en equipo con un sistema
            de gamificación personal. Trabaja mejor, gana puntos y recompénsate.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Comenzar gratis
            </Link>
            <Link
              href="/login"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors px-6 py-3 rounded-xl border border-gray-200 hover:border-gray-300"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>

        {/* Preview card */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8">
            <div className="flex gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-300" />
              <div className="w-3 h-3 rounded-full bg-yellow-300" />
              <div className="w-3 h-3 rounded-full bg-green-300" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-3 font-medium">📋 Por hacer</p>
                <div className="space-y-2">
                  <div className="h-8 bg-gray-50 rounded-lg border border-gray-100 px-3 flex items-center">
                    <span className="text-xs text-gray-400">Diseñar wireframes</span>
                  </div>
                  <div className="h-8 bg-gray-50 rounded-lg border border-gray-100 px-3 flex items-center">
                    <span className="text-xs text-gray-400">Revisar PRs</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-3 font-medium">⏳ En progreso</p>
                <div className="space-y-2">
                  <div className="h-8 bg-yellow-50 rounded-lg border border-yellow-100 px-3 flex items-center">
                    <span className="text-xs text-yellow-600">Desarrollar API</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-3 font-medium">✅ Hecho</p>
                <div className="space-y-2">
                  <div className="h-8 bg-green-50 rounded-lg border border-green-100 px-3 flex items-center">
                    <span className="text-xs text-green-600">Setup del proyecto</span>
                  </div>
                  <div className="h-8 bg-green-50 rounded-lg border border-green-100 px-3 flex items-center">
                    <span className="text-xs text-green-600">Base de datos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Dos modos diseñados para cubrir todas tus necesidades de productividad,
              personal y profesional.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-sm transition-shadow"
              >
                <span className="text-2xl mb-4 block">{feature.icon}</span>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Empieza a ser más productivo hoy
          </h2>
          <p className="text-gray-500 mb-8">
            Crea tu cuenta gratis y comienza a organizar tu vida y tu trabajo
            en minutos.
          </p>
          <Link
            href="/register"
            className="inline-block bg-gray-900 text-white px-8 py-3.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">ProductiveLife</span>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} ProductiveLife. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
