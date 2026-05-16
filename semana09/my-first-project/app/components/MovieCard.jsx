"use client";

export default function MovieCard({ movie, onSelect }) {
  return (
    <div
      onClick={() => onSelect(movie.imdbID)}
      className="group relative overflow-hidden rounded-3xl cursor-pointer shadow-2xl hover:scale-105 transition duration-300"
    >
      <img
        src={
          movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/300x450?text=No+Image"
        }
        alt={movie.Title}
        className="w-full h-[500px] object-cover group-hover:scale-110 transition duration-500"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

      <div className="absolute bottom-0 p-5">
        <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold uppercase">
          {movie.Type}
        </span>

        <h2 className="text-2xl font-bold text-white mt-3">
          {movie.Title}
        </h2>

        <p className="text-gray-300">
          {movie.Year}
        </p>
      </div>
    </div>
  );
}