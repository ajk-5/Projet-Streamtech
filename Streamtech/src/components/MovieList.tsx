import type { Movie } from "../types";
import { getImageUrl } from "../services/tmdbApi";
import MovieCard from "./MovieCard";

function MovieList({ movies }: { movies: Movie[] }) {
  if (movies.length === 0)
    return (
      <div className="alert alert-info">
        Aucun film trouvé. Essayez un autre titre ou un autre genre.
      </div>
    );
  return (
    <>
      <p className="text-body-secondary mb-3">
        {movies.length} film{movies.length > 1 ? "s" : ""} trouvé
        {movies.length > 1 ? "s" : ""}
      </p>
      <div className="row g-4">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            year={movie.release_date?.slice(0, 4)}
            rating={movie.vote_average}
            poster={getImageUrl(movie.poster_path)}
          />
        ))}
      </div>
    </>
  );
}
export default MovieList;
