import type { Movie } from '../types';
import MovieCard from './MovieCard';
function MovieList({ movies }: { movies: Movie[] }) {
  if (!movies.length) return <div className="alert alert-info">Aucun film trouvé.</div>;
  return <div className="row g-4">{movies.map(movie => <MovieCard key={movie.id} id={movie.id} title={movie.title} year={movie.release_date.slice(0, 4)} rating={movie.vote_average} poster={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''} />)}</div>;
}
export default MovieList;
