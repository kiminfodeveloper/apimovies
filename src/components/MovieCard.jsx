import { Link } from "react-router-dom";
import { FaStar, FaCalendarAlt, FaLanguage, FaPlay } from "react-icons/fa";
import "./MovieCard.css";

const imageUrl = import.meta.env.VITE_IMG;

const MovieCard = ({ movie, showLink = true }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Data não disponível";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const getStreamingServices = (providers) => {
    if (!providers || !providers.BR) return null;
    
    const streamingServices = {
      8: "Netflix",
      9: "Prime Video",
      337: "Disney+",
      350: "Apple TV+",
      2: "Apple iTunes",
      3: "Google Play Movies",
      119: "Amazon Prime",
      10: "Amazon Video"
    };

    return providers.BR.flatrate?.map(provider => streamingServices[provider.provider_id]).filter(Boolean);
  };

  const streamingServices = getStreamingServices(movie.watch_providers?.results);

  return (
    <div className="movie-card">
      <div className="movie-card-image">
        <img src={imageUrl + movie.poster_path} alt={movie.title} />
        <div className="movie-card-overlay">
          {showLink && (
            <Link to={`/movie/${movie.id}`} className="details-button">
              Ver Detalhes
            </Link>
          )}
        </div>
      </div>
      <div className="movie-card-info">
        <h2>{movie.title}</h2>
        <div className="movie-card-details">
          <p className="rating">
            <FaStar className="icon" /> {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
          </p>
          <p className="date">
            <FaCalendarAlt className="icon" /> {formatDate(movie.release_date)}
          </p>
          {movie.original_language && (
            <p className="language">
              <FaLanguage className="icon" /> {movie.original_language.toUpperCase()}
            </p>
          )}
          {streamingServices && streamingServices.length > 0 && (
            <div className="streaming-services">
              <FaPlay className="icon" />
              <div className="services-list">
                {streamingServices.map((service, index) => (
                  <span key={index} className="service-tag">{service}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;