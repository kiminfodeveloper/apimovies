import { Link, useNavigate, useLocation } from "react-router-dom";
import { BiCameraMovie, BiSearchAlt2, BiHomeAlt, BiMovie } from "react-icons/bi";
import { useState, useEffect } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
      setSearch("");
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-content">
        <div className="navbar-left">
          <Link to="/" className="logo">
            <BiCameraMovie /> PirateFlix
          </Link>
          <div className="nav-links">
            <Link to="/" className={isActive("/") ? "active" : ""}>
              <BiHomeAlt /> Início
            </Link>
            <Link to="/popular" className={isActive("/popular") ? "active" : ""}>
              <BiMovie /> Populares
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            placeholder="Buscar filmes..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <button type="submit" className="search-button">
            <BiSearchAlt2 />
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;