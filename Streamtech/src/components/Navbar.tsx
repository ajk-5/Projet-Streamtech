import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      className="navbar navbar-expand-md navbar-dark bg-dark py-3"
      aria-label="Navigation principale"
    >
      <div className="container">
        <Link
          className="navbar-brand fs-4"
          to="/"
          onClick={() => setIsOpen(false)}
        >
          🎬 StreamTech
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navigation"
          aria-expanded={isOpen}
          aria-label="Afficher le menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div
          id="navigation"
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
        >
          <div className="navbar-nav ms-auto align-items-md-center gap-md-3">
            <NavLink
              className="nav-link"
              to="/"
              end
              onClick={() => setIsOpen(false)}
            >
              Films
            </NavLink>
            <NavLink
              className="nav-link"
              to="/todos"
              onClick={() => setIsOpen(false)}
            >
              Todos
            </NavLink>
            <NavLink
              className="nav-link"
              to="/contact"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </NavLink>
            <button
              className="btn btn-outline-light btn-sm mt-2 mt-md-0"
              onClick={toggleTheme}
            >
              {theme === "light" ? "☾ Mode sombre" : "☀ Mode clair"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
