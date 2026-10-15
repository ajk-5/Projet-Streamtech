import MovieList from '../components/MovieList';
function Home() {
  const movies = [{ id: 27205, title: 'Inception', release_date: '2010-07-16', vote_average: 8.8, poster_path: null, genre_ids: [] }];
  return <><h1 className="mb-4">🎬 Films Populaires</h1><MovieList movies={movies} /></>;
}
export default Home;
