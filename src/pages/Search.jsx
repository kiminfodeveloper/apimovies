import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { BiSearchAlt2 } from "react-icons/bi"
import MovieCard from "../components/MovieCard"
import './Search.css'

// Configuração da API
const API_BASE_URL = "https://api.themoviedb.org/3"
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYmE3YTE1NzFlNzExYmRhYmUyOWZjMDNjMGZkYzdlNyIsIm5iZiI6MTY1NzYzNzg2OC44NTEsInN1YiI6IjYyY2Q4YmVjZTgxMzFkMWRjOWYzNWYzOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4iF9brkZYZB9NJQw0rS8NSNyImp6puoeLY6UGyF7ZC4"

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const navigate = useNavigate()
  const query = searchParams.get("q")

  const searchMovies = async (searchQuery, pageNumber = 1) => {
    try {
      setLoading(true)
      setError(null)

      const url = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(searchQuery)}&page=${pageNumber}&language=pt-BR&include_adult=false&append_to_response=watch/providers`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`
        }
      })

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      const data = await response.json()
      
      // Adiciona informações de streaming aos resultados
      const moviesWithProviders = await Promise.all(
        data.results.map(async (movie) => {
          try {
            const providerResponse = await fetch(
              `${API_BASE_URL}/movie/${movie.id}/watch/providers`,
              {
                headers: {
                  'accept': 'application/json',
                  'Authorization': `Bearer ${AUTH_TOKEN}`
                }
              }
            )
            const providerData = await providerResponse.json()
            return {
              ...movie,
              watch_providers: providerData
            }
          } catch (error) {
            console.error(`Erro ao buscar providers para o filme ${movie.id}:`, error)
            return movie
          }
        })
      )
      
      if (pageNumber === 1) {
        setMovies(moviesWithProviders)
      } else {
        setMovies(prev => [...prev, ...moviesWithProviders])
      }
      
      setTotalPages(data.total_pages)
      setPage(pageNumber)
    } catch (error) {
      console.error("Erro ao buscar filmes:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (query) {
      searchMovies(query, 1)
    } else {
      setMovies([])
      setPage(1)
      setTotalPages(0)
    }
  }, [query])

  const handleSearch = (e) => {
    e.preventDefault()
    const searchInput = e.target.search.value.trim()
    
    if (searchInput) {
      navigate(`/search?q=${encodeURIComponent(searchInput)}`)
    }
  }

  const loadMore = () => {
    if (page < totalPages) {
      searchMovies(query, page + 1)
    }
  }

  if (!query) {
    return (
      <div className="search-container">
        <div className="search-empty">
          <BiSearchAlt2 className="search-icon" />
          <h2>Busque por filmes</h2>
          <p>Use a barra de pesquisa para encontrar seus filmes favoritos</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Erro ao buscar filmes</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/")}>Voltar para Home</button>
      </div>
    )
  }

  return (
    <div className="search-container">
      <div className="search-header">
        <h2 className="search-title">
          Resultados para: <span className="query-text">{query}</span>
        </h2>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            name="search"
            placeholder="Buscar filmes..."
            defaultValue={query}
          />
          <button type="submit">
            <BiSearchAlt2 />
          </button>
        </form>
      </div>

      {loading && movies.length === 0 ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Buscando filmes...</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="no-results">
          <p>Nenhum filme encontrado para "{query}"</p>
        </div>
      ) : (
        <>
          <div className="movies-container">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          {page < totalPages && (
            <div className="load-more">
              <button onClick={loadMore} disabled={loading}>
                {loading ? "Carregando..." : "Carregar Mais"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Search