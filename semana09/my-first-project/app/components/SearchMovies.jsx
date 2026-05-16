"use client";

import { useEffect, useState } from "react";
import { searchMovies, getMovieById } from "../services/omdb";

import MovieCard from "./MovieCard";
import MovieModal from "./MovieModal";

export default function SearchMovies() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchMovies();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const fetchMovies = async () => {
    const cleanSearch = search.trim();

    if (cleanSearch.length < 3) {
      setMovies([]);
      setMessage("");
      return;
    }

    setLoading(true);

    try {
      const data = await searchMovies(cleanSearch);

      if (data.Response === "True") {
        setMovies(data.Search);
        setMessage("");
      } else {
        setMovies([]);
        setMessage("No se encontraron resultados");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error al buscar películas");
    } finally {
      setLoading(false);
    }
  };

  const showMovieDetail = async (id) => {
    try {
      const data = await getMovieById(id);
      setSelectedMovie(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">

      {/* INPUT */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar películas o series..."
          className="w-full p-5 rounded-2xl bg-gray-800 border border-red-500 text-white text-lg outline-none focus:ring-2 focus:ring-red-500 shadow-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="absolute right-5 top-5 text-gray-400">
          🔍
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-300 text-lg">
          Buscando...
        </p>
      )}

      {/* MENSAJE */}
      {!loading && message && (
        <p className="text-center text-red-400 text-lg">
          {message}
        </p>
      )}

      {/* RESULTADOS */}
      {!loading && movies.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold mb-6">
            Resultados
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {movies.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                onSelect={showMovieDetail}
              />
            ))}
          </div>
        </div>
      )}

      {/* MODAL */}
      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}