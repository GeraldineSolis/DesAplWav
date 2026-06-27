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
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-semibold text-gray-900">
            ProductStore
          </Link>

          <div className="flex gap-6 items-center">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Productos
            </Link>

            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Admin
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex gap-4 items-center">
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">{user?.email}</p>
                  <p className="text-gray-500 text-xs">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
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