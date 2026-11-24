import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import Icon from "./Icon";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      className="navbar navbar-expand-md navbar-dark site-navbar py-3"
      aria-label="Navigation principale"
    >
      <div className="container">
        <Link
          className="navbar-brand d-flex align-items-center gap-2 fs-4"
          to="/"
          onClick={() => setIsOpen(false)}
        >
          <span className="brand-icon">
            <Icon name="film" />
          </span>
          <b>StreamTech</b>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navigation"
          aria-expanded={isOpen}
          aria-label="Afficher le menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Icon name={isOpen ? "close" : "menu"} />
        </button>
        <div
          id="navigation"
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
        >
          <div className="navbar-nav ms-auto align-items-md-center gap-2 pt-3 pt-md-0">
            <NavLink
              className="nav-link d-flex align-items-center gap-2"
              to="/"
              end
              onClick={() => setIsOpen(false)}
            >
              <Icon name="film" /> Films
            </NavLink>
            <NavLink
              className="nav-link d-flex align-items-center gap-2"
              to="/todos"
              onClick={() => setIsOpen(false)}
            >
              <Icon name="tasks" /> Todos
            </NavLink>
            <NavLink
              className="nav-link d-flex align-items-center gap-2"
              to="/contact"
              onClick={() => setIsOpen(false)}
            >
              <Icon name="mail" /> Contact
            </NavLink>
            <button
              className="btn btn-outline-light btn-sm theme-button d-flex align-items-center gap-2 ms-md-3"
              onClick={toggleTheme}
            >
              <Icon name={theme === "light" ? "moon" : "sun"} />
              {theme === "light" ? "Mode sombre" : "Mode clair"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
