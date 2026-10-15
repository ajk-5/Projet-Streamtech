import { useEffect, useState } from "react";
import type { Genre, Movie } from "../types";
import {
  getGenres,
  getMoviesByGenre,
  getPopularMovies,
  searchMovies,
} from "../services/tmdbApi";
import SearchBar from "../components/SearchBar";
import MovieList from "../components/MovieList";
import Loading from "../components/Loading";

function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [genreError, setGenreError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getGenres(controller.signal)
      .then((data) => {
        setGenres(data);
        setGenreError("");
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setGenreError("Les genres sont indisponibles pour le moment.");
      });
    return () => controller.abort();
  }, [retry]);

  useEffect(() => {
    const controller = new AbortController();
    // On attend 500 ms pour éviter un appel API à chaque lettre saisie.
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        let data: Movie[];
        if (searchTerm.trim()) {
          data = await searchMovies(searchTerm.trim(), controller.signal);
        } else if (genre)
          data = await getMoviesByGenre(genre, controller.signal);
        else data = await getPopularMovies(controller.signal);
        if (!controller.signal.aborted) setMovies(data);
      } catch {
        if (!controller.signal.aborted)
          setError(
            "Impossible de charger les films. Vérifiez votre connexion et la clé TMDB.",
          );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 500);
    // Annuler la requête précédente empêche une ancienne réponse de remplacer la recherche.
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchTerm, genre, retry]);

  return (
    <>
      <h1 className="mb-4">🎬 Films Populaires</h1>
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={(value) => {
              setSearchTerm(value);
              setGenre("");
              setLoading(true);
            }}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="genre" className="form-label">
            Genre
          </label>
          <select
            id="genre"
            className="form-select"
            value={genre}
            onChange={(event) => {
              setGenre(event.target.value);
              setSearchTerm("");
              setLoading(true);
            }}
          >
            <option value="">Tous les genres</option>
            {genres.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {(searchTerm || genre) && (
        <button
          className="btn btn-outline-secondary mb-4"
          onClick={() => {
            setSearchTerm("");
            setGenre("");
            setLoading(true);
          }}
        >
          Réinitialiser
        </button>
      )}
      {genreError && (
        <div className="alert alert-warning">
          {genreError}{" "}
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setRetry(retry + 1)}
          >
            Réessayer
          </button>
        </div>
      )}
      <p className="text-body-secondary">
        {searchTerm.trim()
          ? `Résultats pour "${searchTerm}"`
          : genre
            ? `Films du genre : ${genres.find((item) => item.id === Number(genre))?.name || ""}`
            : "Films populaires"}
      </p>
      {loading ? (
        <Loading />
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}{" "}
          <button
            className="btn btn-sm btn-outline-danger ms-2"
            onClick={() => setRetry(retry + 1)}
          >
            Réessayer
          </button>
        </div>
      ) : (
        <MovieList movies={movies} />
      )}
    </>
  );
}
export default Home;
