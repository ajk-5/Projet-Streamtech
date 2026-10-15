import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { MovieDetail } from "../types";
import { getImageUrl, getMovieDetails } from "../services/tmdbApi";
import Loading from "../components/Loading";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function loadMovie() {
      setLoading(true);
      setError("");
      try {
        if (!id || !/^\d+$/.test(id)) throw new Error("Identifiant invalide");
        const data = await getMovieDetails(id, controller.signal);
        if (!controller.signal.aborted) setMovie(data);
      } catch {
        if (!controller.signal.aborted)
          setError("Ce film est introuvable ou indisponible pour le moment.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadMovie();
    return () => controller.abort();
  }, [id]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
          <Link to="/" className="btn btn-primary ms-3">
            Retour à l'accueil
          </Link>
        </div>
      ) : (
        movie && (
          <>
            {movie.backdrop_path ? (
              <div
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  padding: "100px 24px",
                  marginBottom: "30px",
                }}
              >
                <button
                  className="btn btn-outline-light mb-3"
                  onClick={() => navigate(-1)}
                >
                  ← Retour
                </button>
                <h1 className="text-white display-4">{movie.title}</h1>
                <p className="text-white fs-5">
                  {movie.release_date?.slice(0, 4)}
                </p>
              </div>
            ) : (
              <div className="mb-4">
                <Link to="/" className="btn btn-outline-secondary mb-3">
                  ← Retour
                </Link>
                <h1>{movie.title}</h1>
                <p>{movie.release_date?.slice(0, 4)}</p>
              </div>
            )}
            <div className="row g-4 g-lg-5">
              <div className="col-md-4">
                {movie.poster_path ? (
                  <img
                    className="movie-poster rounded"
                    src={getImageUrl(movie.poster_path)}
                    alt={`Affiche de ${movie.title}`}
                  />
                ) : (
                  <div className="movie-poster poster-placeholder rounded">
                    Affiche indisponible
                  </div>
                )}
                <div className="card mt-3">
                  <div className="card-body">
                    <h2 className="h5">Informations</h2>
                    <p className="mb-1">
                      <strong>Note :</strong> ⭐ {movie.vote_average.toFixed(1)}
                      /10
                    </p>
                    <p className="mb-1">
                      <strong>Durée :</strong>{" "}
                      {movie.runtime
                        ? `${movie.runtime} min`
                        : "Durée inconnue"}
                    </p>
                    <div className="d-flex flex-wrap gap-2">
                      <strong>Genres :</strong>
                      {movie.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="badge text-bg-secondary"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <h2 className="h4">Synopsis</h2>
                <p className="lead">
                  {movie.overview || "Aucun synopsis disponible."}
                </p>
                <hr className="my-4" />
                <h2 className="h4 mb-3">Distribution</h2>
                <div className="row g-3">
                  {movie.credits.cast.slice(0, 8).map((actor) => (
                    <div className="col-6 col-md-3" key={actor.id}>
                      <div className="card h-100">
                        <div className="card-body">
                          {actor.profile_path && (
                            <img
                              className="cast-photo rounded mb-2"
                              src={getImageUrl(actor.profile_path)}
                              alt={actor.name}
                              loading="lazy"
                            />
                          )}
                          <h3 className="h6">{actor.name}</h3>
                          <p className="small text-body-secondary mb-0">
                            {actor.character}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {movie.credits.cast.length === 0 && (
                  <p className="text-body-secondary">
                    Distribution indisponible.
                  </p>
                )}
              </div>
            </div>
          </>
        )
      )}
    </>
  );
}
export default MovieDetails;
