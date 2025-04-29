import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { BsGraphUp, BsWallet2, BsHourglassSplit, BsFillFileEarmarkTextFill, BsArrowLeft } from "react-icons/bs";
import { FaStar, FaLanguage, FaCalendarAlt } from "react-icons/fa";

import "./Movie.css";

const moviesURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;
const imageUrl = import.meta.env.VITE_IMG;

const Movie = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const getMovie = async (url) => {
    setLoading(true);
    try {
      const res = await fetch(url);
      const data = await res.json();
      setMovie(data);
    } catch (error) {
      console.error("Erro ao carregar o filme:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (number) => {
    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  useEffect(() => {
    const movieUrl = `${moviesURL}${id}?${apiKey}`;
    getMovie(movieUrl);
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando filme...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="error-container">
        <h2>Filme não encontrado</h2>
        <Link to="/" className="back-button">
          <BsArrowLeft /> Voltar para Home
        </Link>
      </div>
    );
  }

  return (
    <div className="movie-page">
      <div className="movie-header">
        <Link to="/" className="back-button">
          <BsArrowLeft /> Voltar
        </Link>
        <div className="movie-header-content">
          <div className="movie-poster">
            <img src={imageUrl + movie.poster_path} alt={movie.title} />
          </div>
          <div className="movie-header-info">
            <h1>{movie.title}</h1>
            <p className="tagline">{movie.tagline}</p>
            <div className="movie-meta">
              <span className="rating">
                <FaStar /> {movie.vote_average.toFixed(1)}
              </span>
              <span className="date">
                <FaCalendarAlt /> {formatDate(movie.release_date)}
              </span>
              <span className="language">
                <FaLanguage /> {movie.original_language.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="movie-details">
        <div className="movie-stats">
          <div className="stat-item">
            <h3><BsWallet2 /> Orçamento</h3>
            <p>{formatCurrency(movie.budget)}</p>
          </div>
          <div className="stat-item">
            <h3><BsGraphUp /> Receita</h3>
            <p>{formatCurrency(movie.revenue)}</p>
          </div>
          <div className="stat-item">
            <h3><BsHourglassSplit /> Duração</h3>
            <p>{movie.runtime} minutos</p>
          </div>
        </div>

        <div className="movie-description">
          <h3><BsFillFileEarmarkTextFill /> Sinopse</h3>
          <p>{movie.overview}</p>
        </div>

        {movie.genres && movie.genres.length > 0 && (
          <div className="movie-genres">
            <h3>Gêneros</h3>
            <div className="genres-list">
              {movie.genres.map((genre) => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movie;