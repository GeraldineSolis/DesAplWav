'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/80 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
              P
            </span>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight">
              ProductStore
            </span>
          </Link>

          <div className="flex gap-6 items-center">
            <Link
              href="/"
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors duration-200 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 hover:after:w-full after:transition-all after:duration-300"
            >
              Productos
            </Link>

            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors duration-200 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 hover:after:w-full after:transition-all after:duration-300"
              >
                Admin
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex gap-4 items-center pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-slate-800 text-sm font-semibold leading-tight">{user?.email}</p>
                  <span className={`inline-block mt-0.5 px-2 py-0.5 text-[10px] font-black tracking-wider uppercase rounded-full ${
                    user?.role === 'ADMIN' 
                      ? 'bg-violet-100 text-violet-700 border border-violet-200/50' 
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-200/50'
                  }`}>
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 hover:text-rose-700 transition-colors duration-200 text-sm font-semibold cursor-pointer border border-rose-100"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex gap-3 items-center pl-4 border-l border-slate-200">
                <Link
                  href="/login"
                  className="px-4 py-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors duration-200 text-sm font-semibold"
                >
                  Ingresar
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg hover:from-indigo-700 hover:to-violet-700 hover:shadow-md hover:shadow-indigo-500/10 transition-all duration-200 text-sm font-semibold"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}