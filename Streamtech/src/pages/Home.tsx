import { useEffect, useState } from 'react';
import type { Movie } from '../types';
import { getPopularMovies } from '../services/tmdbApi';
import MovieList from '../components/MovieList';
import Loading from '../components/Loading';
function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    getPopularMovies(controller.signal).then(data => { if (!controller.signal.aborted) setMovies(data); }).catch(() => { if (!controller.signal.aborted) setError('Impossible de charger les films.'); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);
  return <><h1 className="mb-4">🎬 Films Populaires</h1>{loading ? <Loading /> : error ? <div className="alert alert-danger">{error}</div> : <MovieList movies={movies} />}</>;
}
export default Home;
