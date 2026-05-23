"use client";

import { useEffect } from "react";
import Link from "next/link";
import { IoWarning, IoRefresh, IoArrowBack } from "react-icons/io5";

export default function RickAndMortyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error Rick & Morty:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-900 rounded-full p-6">
            <IoWarning className="text-red-400 text-7xl animate-pulse" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">¡Wubba Lubba Dub Dub!</h1>
        <p className="text-gray-400 mb-2">Algo salió muy mal en el universo C-137.</p>
        {error.message && (
          <p className="text-red-400 text-sm bg-red-950 rounded-lg px-4 py-2 mb-6 font-mono">
            {error.message}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            <IoRefresh size={20} /> Intentar de nuevo
          </button>
          <Link
            href="/rick-and-morty"
            className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            <IoArrowBack size={20} /> Volver
          </Link>
        </div>
      </div>
    </div>
  );
}