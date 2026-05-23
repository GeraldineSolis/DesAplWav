// src/app/pokemon/[name]/not-found.tsx
import Link from "next/link";
import Image from "next/image";
import { IoSearch, IoArrowBack } from "react-icons/io5";

export default function PokemonNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-gray-900 p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        {/* Imagen de Pokémon desconocido (silueta) */}
        <div className="flex justify-center mb-6">
          <Image
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/54.svg"
            alt="Pokémon no encontrado"
            width={150}
            height={150}
            className="opacity-20 grayscale"
          />
        </div>

        {/* Número estilo Pokédex */}
        <p className="text-gray-400 text-sm mb-2">#404 – Pokémon desconocido</p>

        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          ¡Pokémon no encontrado!
        </h1>

        {/* Descripción */}
        <p className="text-gray-600 mb-6">
          Este Pokémon no existe en la Pokédex o el nombre ingresado es incorrecto.
          Asegúrate de escribir el nombre en inglés y en minúsculas.
        </p>

        {/* Ejemplo */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3 mb-6 text-sm text-purple-700">
          <IoSearch className="inline-block mr-1" />
          Ejemplo correcto:{" "}
          <Link href="/pokemon/pikachu" className="font-bold underline hover:text-purple-900">
            /pokemon/pikachu
          </Link>
        </div>

        {/* Botón volver */}
        <Link
          href="/pokemon"
          className="inline-flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-8 rounded-lg transition"
        >
          <IoArrowBack size={20} />
          Volver al Pokédex
        </Link>
      </div>
    </div>
  );
}