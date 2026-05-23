import Link from "next/link";
import Image from "next/image";
import { RickAndMortyResponse, RickAndMortyCharacter } from "@/types/rickandmorty";
import { IoFlash } from "react-icons/io5";

// SSG con revalidación cada 10 días (ISR)
async function getCharacters(): Promise<RickAndMortyCharacter[]> {
  const res = await fetch("https://rickandmortyapi.com/api/character", {
    cache: "force-cache", // SSG
    next: { revalidate: 864000 }, // ISR: 10 días
  });
  if (!res.ok) throw new Error("Error al cargar personajes");
  const data: RickAndMortyResponse = await res.json();
  return data.results;
}

const statusColor: Record<string, string> = {
  Alive: "bg-green-500",
  Dead: "bg-red-500",
  unknown: "bg-gray-400",
};

export default async function RickAndMortyPage() {
  const characters = await getCharacters();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-green-400 mb-2 flex items-center gap-3">
          <IoFlash size={36} /> Personajes (SSG)
        </h1>
        <p className="text-green-200 text-sm mb-10">
          Mostrando los primeros 20 personajes · Revalidación cada 10 días (ISR)
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {characters.map((character) => (
            <Link
              key={character.id}
              href={`/rick-and-morty/${character.id}`}
              className="transform transition hover:scale-105"
            >
              <div className="bg-gray-800 text-white rounded-xl overflow-hidden shadow-lg hover:shadow-green-900 hover:shadow-xl cursor-pointer">
                {/* Imagen con Lazy Loading */}
                <Image
                  src={character.image}
                  alt={character.name}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover"
                  loading="lazy" // Lazy Loading
                />
                <div className="p-4">
                  <h2 className="text-lg font-bold truncate">{character.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`w-2 h-2 rounded-full ${statusColor[character.status]}`}
                    />
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
      </div>
    </div>
  );
}