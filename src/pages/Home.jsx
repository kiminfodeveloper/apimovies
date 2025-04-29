import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import "./Home.css";

const moviesURL = import.meta.env.VITE_API;
const apiKey = import.meta.env.VITE_API_KEY;

const Home = () => {
  const [topMovies, setTopMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMovies = async (url, setState) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      setState(data.results);
    } catch (error) {
      console.error("Erro ao carregar filmes:", error);
    }
  };

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        await Promise.all([
          getMovies(`${moviesURL}top_rated?${apiKey}`, setTopMovies),
          getMovies(`${moviesURL}popular?${apiKey}`, setPopularMovies),
          getMovies(`${moviesURL}upcoming?${apiKey}`, setUpcomingMovies),
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  if (loading) {
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
          {popularMovies.length > 0 && 
            popularMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))
          }
        </div>
      </section>

      <section className="movies-section">
        <h2 className="section-title">Melhores Avaliados</h2>
        <div className="movies-container">
          {topMovies.length > 0 && 
            topMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))
          }
        </div>
      </section>

      <section className="movies-section">
        <h2 className="section-title">Em Breve</h2>
        <div className="movies-container">
          {upcomingMovies.length > 0 && 
            upcomingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))
          }
        </div>
      </section>
    </div>
  );
};

export default Home;