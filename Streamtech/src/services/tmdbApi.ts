import type { Genre, Movie, MovieDetail } from "../types";

// La clé du sujet peut être remplacée dans le fichier .env.local.
const API_KEY =
  import.meta.env.VITE_TMDB_API_KEY || "08a341931ab5f5dcee467baeb4a68c76";
const BASE_URL = "https://api.themoviedb.org/3";

async function request(path: string, params = "", signal?: AbortSignal) {
  const response = await fetch(
    `${BASE_URL}${path}?api_key=${API_KEY}&language=fr-FR${params}`,
    { signal },
  );
  if (!response.ok)
    throw new Error(
      "Impossible de charger les films. Vérifiez votre connexion et la clé TMDB.",
    );
  return response.json();
}

export async function getPopularMovies(signal?: AbortSignal): Promise<Movie[]> {
  const data = await request("/movie/popular", "&page=1", signal);
  return data.results;
}
export async function searchMovies(
  query: string,
  signal?: AbortSignal,
): Promise<Movie[]> {
  const data = await request(
    "/search/movie",
    `&query=${encodeURIComponent(query)}&include_adult=false`,
    signal,
  );
  return data.results;
}
export async function getGenres(signal?: AbortSignal): Promise<Genre[]> {
  const data = await request("/genre/movie/list", "", signal);
  return data.genres;
}
export async function getMoviesByGenre(
  genreId: string,
  signal?: AbortSignal,
): Promise<Movie[]> {
  const data = await request(
    "/discover/movie",
    `&with_genres=${genreId}&sort_by=popularity.desc`,
    signal,
  );
  return data.results;
}
export function getMovieDetails(
  id: string,
  signal?: AbortSignal,
): Promise<MovieDetail> {
  return request(`/movie/${id}`, "&append_to_response=credits", signal);
}
export function getImageUrl(path: string | null) {
  return path ? `https://image.tmdb.org/t/p/w500${path}` : "";
}
