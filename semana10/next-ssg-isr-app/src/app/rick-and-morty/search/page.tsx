"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { RickAndMortyCharacter, RickAndMortyResponse } from "@/types/rickandmorty";
import { IoSearch } from "react-icons/io5";

const statusColor: Record<string, string> = {
  Alive: "bg-green-500",
  Dead: "bg-red-500",
  unknown: "bg-gray-400",
};

export default function SearchPage() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");
  const [results, setResults] = useState<RickAndMortyCharacter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // CSR: se ejecuta en el cliente cada vez que cambian los filtros
  useEffect(() => {
    const params = new URLSearchParams();
    if (name) params.append("name", name);
    if (status) params.append("status", status);
    if (type) params.append("type", type);
    if (gender) params.append("gender", gender);

    const query = params.toString();

    setLoading(true);
    setError("");

    fetch(`https://rickandmortyapi.com/api/character${query ? `?${query}` : ""}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se encontraron personajes");
        return res.json();
      })
      .then((data: RickAndMortyResponse) => setResults(data.results))
      .catch((err) => {
        setError(err.message);
        setResults([]);
      })
      .finally(() => setLoading(false));
  }, [name, status, type, gender]);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-green-400 mb-6 flex items-center gap-3">
          <IoSearch size={36} /> Buscar Personajes
        </h1>

        {/* Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <input
            type="text"
            placeholder="Nombre..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-green-400 outline-none"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-green-400 outline-none"
          >
            <option value="">Estado</option>
            <option value="alive">Alive</option>
            <option value="dead">Dead</option>
            <option value="unknown">Unknown</option>
          </select>
          <input
            type="text"
            placeholder="Tipo (ej: Parasite)..."
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-green-400 outline-none"
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-green-400 outline-none"
          >
            <option value="">Género</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="genderless">Genderless</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        {/* Estado de carga / error */}
        {loading && (
          <p className="text-green-300 text-center animate-pulse">Buscando...</p>
        )}
        {error && (
          <p className="text-red-400 text-center bg-red-950 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        {/* Resultados */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((character) => (
              <Link
                key={character.id}
                href={`/rick-and-morty/${character.id}`}
                className="transform transition hover:scale-105"
              >
                <div className="bg-gray-800 text-white rounded-xl overflow-hidden shadow-lg hover:shadow-green-900">
                  <Image
                    src={character.image}
                    alt={character.name}
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-bold truncate">{character.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`w-2 h-2 rounded-full ${statusColor[character.status]}`} />
                      <span className="text-gray-300 text-sm">
                        {character.status} · {character.species}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mt-2 truncate">
                      📍 {character.location.name}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}