// src/app/pokemon/error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { IoWarning, IoRefresh, IoArrowBack } from "react-icons/io5";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PokemonError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Puedes registrar el error en un servicio de monitoreo
    console.error("Error en Pokédex:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 to-gray-900 p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        {/* Ícono de error animado */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 rounded-full p-6">
            <IoWarning className="text-red-500 text-7xl animate-pulse" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          ¡Algo salió mal!
        </h1>

        {/* Número estilo Pokédex */}
        <p className="text-gray-400 text-sm mb-4">#ERR – Pokédex Error</p>

        {/* Mensaje del error */}
        <p className="text-gray-600 mb-2">
          No se pudo cargar la información del Pokémon.
        </p>
        {error.message && (
          <p className="text-red-500 text-sm bg-red-50 rounded-lg px-4 py-2 mb-6 font-mono">
            {error.message}
          </p>
        )}

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            <IoRefresh size={20} />
            Intentar de nuevo
          </button>

          <Link
            href="/pokemon"
            className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            <IoArrowBack size={20} />
            Volver al Pokédex
          </Link>
        </div>
      </div>
    </div>
  );
}