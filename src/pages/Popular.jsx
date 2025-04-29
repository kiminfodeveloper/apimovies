import { useState, useEffect, useRef } from "react";
import MovieCard from "../components/MovieCard";
import "./Home.css";

const moviesURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;

const Popular = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const movieIdsRef = useRef(new Set());

  const getPopularMovies = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      
      // Filtra filmes duplicados usando o Set de IDs
      const newMovies = data.results.filter(movie => {
        if (movieIdsRef.current.has(movie.id)) {
          return false;
        }
        movieIdsRef.current.add(movie.id);
        return true;
      });
      
      setPopularMovies(prev => [...prev, ...newMovies]);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Erro ao carregar filmes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      const popularUrl = `${moviesURL}popular?${apiKey}&page=${page}`;
      await getPopularMovies(popularUrl);
    };

    loadMovies();
  }, [page]);

  const loadMore = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  if (loading && popularMovies.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando filmes...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <section className="movies-section">
        <h2 className="section-title">Filmes Populares</h2>
        <div className="movies-container">
          {popularMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        {popularMovies.length > 0 && page < totalPages && (
          <div className="load-more">
            <button onClick={loadMore} disabled={loading}>
              {loading ? "Carregando..." : "Carregar Mais"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Popular; 