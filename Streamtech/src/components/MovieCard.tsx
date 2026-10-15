import { useState } from "react";
import { Link } from "react-router-dom";

interface MovieCardProps {
  id: number;
  title: string;
  year: string;
  rating: number;
  poster: string;
}

function MovieCard({ id, title, year, rating, poster }: MovieCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="col-6 col-md-4 col-lg-3">
      <article className="card h-100 movie-card border-danger">
        <Link to={`/movie/${id}`} className="text-decoration-none text-body">
          {poster && !imageError ? (
            <img
              src={poster}
              className="card-img-top movie-poster"
              alt={`Affiche de ${title}`}
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="movie-poster poster-placeholder">
              Affiche indisponible
            </div>
          )}
          <div className="card-body pb-2">
            <h3 className="h6 card-title">{title}</h3>
            <div className="d-flex flex-wrap gap-2 small">
              <span className="text-body-secondary">
                {year || "Date inconnue"}
              </span>
              <span className="badge text-bg-warning">
                ★ {rating.toFixed(1)}/10
              </span>
            </div>
          </div>
        </Link>
        <div className="card-body pt-2 mt-auto">
          <button
            className={`btn btn-sm ${isLiked ? "btn-danger" : "btn-outline-danger"}`}
            aria-pressed={isLiked}
            aria-label={`${isLiked ? "Ne plus aimer" : "Aimer"} ${title}`}
            onClick={() => setIsLiked(!isLiked)}
          >
            {isLiked ? "♥" : "♡"} {isLiked ? 1 : 0} like
          </button>
        </div>
      </article>
    </div>
  );
}
export default MovieCard;
