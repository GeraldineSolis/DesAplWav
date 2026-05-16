"use client";

export default function MovieModal({ movie, onClose }) {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">      <div className="bg-white text-black w-[90%] md:w-[700px] rounded-2xl overflow-hidden shadow-2xl relative">

      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 bg-red-500 text-white w-10 h-10 rounded-full hover:bg-red-600 transition"
      >
        ✕
      </button>

      <div className="bg-gray-900 text-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl relative border border-gray-700">
        {/* Poster */}
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="w-full h-[500px] object-cover rounded-xl"
        />

        {/* Información */}
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">
            {movie.Title}
          </h2>

          <p className="text-gray-300 mb-2">
            <span className="font-semibold">Año:</span> {movie.Year}
          </p>

          <p className="text-gray-300 mb-2">
            <span className="font-semibold">Género:</span> {movie.Genre}
          </p>

          <p className="text-gray-300 mb-2">
            <span className="font-semibold">Director:</span> {movie.Director}
          </p>

          <p className="text-gray-300 mb-2">
            <span className="font-semibold">Actores:</span> {movie.Actors}
          </p>

          <p className="text-gray-300 mb-4">
            <span className="font-semibold">IMDb:</span> ⭐ {movie.imdbRating}
          </p>

          <div>
            <h3 className="font-bold text-lg mb-2">
              Sinopsis
            </h3>

            <p className="text-gray-600">
              {movie.Plot}
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}