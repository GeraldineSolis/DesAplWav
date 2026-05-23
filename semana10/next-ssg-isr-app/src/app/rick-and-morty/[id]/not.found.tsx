import Link from "next/link";
import { IoAlertCircle, IoArrowBack } from "react-icons/io5";

export default function CharacterNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-950 rounded-full p-6">
            <IoAlertCircle className="text-green-400 text-7xl" />
          </div>
        </div>
        <p className="text-gray-400 text-sm mb-2">#404 – Personaje desconocido</p>
        <h1 className="text-3xl font-bold text-white mb-4">
          ¡Personaje no encontrado!
        </h1>
        <p className="text-gray-400 mb-6">
          Este personaje no existe o fue eliminado en otra dimensión.
          Verifica que el ID sea correcto.
        </p>
        <Link
          href="/rick-and-morty"
          className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition"
        >
          <IoArrowBack size={20} /> Volver a personajes
        </Link>
      </div>
    </div>
  );
}