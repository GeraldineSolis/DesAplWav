import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RickAndMortyCharacter, RickAndMortyResponse } from "@/types/rickandmorty";
import { IoArrowBack } from "react-icons/io5";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getCharacter(id: string): Promise<RickAndMortyCharacter> {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`, {
    next: { revalidate: 864000 }, // ISR: 10 días
  });
  if (!res.ok) notFound();
  return res.json();
}

// SSG: genera rutas estáticas para todos los personajes
export async function generateStaticParams() {
  const res = await fetch("https://rickandmortyapi.com/api/character");
  const data: RickAndMortyResponse = await res.json();
  return data.results.map((c) => ({ id: String(c.id) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const character = await getCharacter(id);
  return {
    title: `${character.name} - Rick & Morty`,
    description: `${character.status} · ${character.species}`,
  };
}

const statusColor: Record<string, string> = {
  Alive: "text-green-500",
  Dead: "text-red-500",
  unknown: "text-gray-400",
};
const statusDot: Record<string, string> = {
  Alive: "bg-green-500",
  Dead: "bg-red-500",
  unknown: "bg-gray-400",
};

export default async function CharacterDetailPage({ params }: PageProps) {
  const { id } = await params;
  const character = await getCharacter(id);

  const fields = [
    { label: "Estado", value: character.status },
    { label: "Especie", value: character.species },
    { label: "Tipo", value: character.type || "N/A" },
    { label: "Género", value: character.gender },
    { label: "Origen", value: character.origin.name },
    { label: "Última ubicación", value: character.location.name },
    { label: "Episodios", value: `${character.episode.length} episodios` },
    { label: "Creado", value: new Date(character.created).toLocaleDateString("es-ES") },
  ];

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative h-48 bg-gradient-to-r from-green-900 to-gray-900 flex items-end p-6">
          <div className="absolute -bottom-16 left-8">
            <Image
              src={character.image}
              alt={character.name}
              width={160}
              height={160}
              className="rounded-full border-4 border-gray-800 shadow-xl"
            />
          </div>
        </div>

        {/* Info principal */}
        <div className="pt-20 px-8 pb-8">
          <div className="flex items-center gap-3 mb-1">
            <span className={`w-3 h-3 rounded-full ${statusDot[character.status]}`} />
            <span className={`font-semibold ${statusColor[character.status]}`}>
              {character.status}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{character.name}</h1>
          <p className="text-gray-400 text-sm mb-8">#{character.id}</p>

          {/* Tabla de campos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {fields.map(({ label, value }) => (
              <div key={label} className="bg-gray-700 rounded-lg px-4 py-3">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                  {label}
                </p>
                <p className="text-white font-semibold">{value}</p>
              </div>
            ))}
          </div>

          {/* Botón volver */}
          <Link
            href="/rick-and-morty"
            className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            <IoArrowBack size={20} /> Volver a personajes
          </Link>
        </div>
      </div>
    </div>
  );
}