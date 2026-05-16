const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const BASE_URL = "https://www.omdbapi.com/";

export async function searchMovies(search) {
  const response = await fetch(
    `${BASE_URL}?apikey=${API_KEY}&s=${search}`
  );

  return response.json();
}

export async function getMovieById(id) {
  const response = await fetch(
    `${BASE_URL}?apikey=${API_KEY}&i=${id}`
  );

  return response.json();
}