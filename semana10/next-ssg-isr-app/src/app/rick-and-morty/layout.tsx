import { ReactNode } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { IoSearch, IoPlanet } from "react-icons/io5";

export const metadata: Metadata = {
  title: "Rick & Morty - Next.js",
  description: "Explora los personajes de Rick and Morty",
};

export default function RickAndMortyLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 to-gray-900">
      <nav className="bg-black bg-opacity-40 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex gap-6 items-center">
          <Link
            href="/rick-and-morty"
            className="text-green-400 text-2xl font-bold hover:text-green-300 transition flex items-center gap-2"
          >
            <IoPlanet size={28} /> Rick & Morty
          </Link>
          <Link
            href="/rick-and-morty/search"
            className="text-green-300 hover:text-white transition flex items-center gap-2 text-sm font-semibold"
          >
            <IoSearch size={18} /> Buscar
          </Link>
        </div>
      </nav>
      {children}
    </div>
  );
}