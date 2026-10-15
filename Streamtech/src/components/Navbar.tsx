import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
function Navbar() {
  const [open, setOpen] = useState(false);
  return <nav className="navbar navbar-expand-md navbar-dark bg-dark"><div className="container">
    <Link className="navbar-brand" to="/">🎬 StreamTech</Link>
    <button className="navbar-toggler" aria-label="Afficher le menu" aria-expanded={open} onClick={() => setOpen(!open)}><span className="navbar-toggler-icon" /></button>
    <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}><div className="navbar-nav ms-auto">
      <NavLink className="nav-link" to="/" end onClick={() => setOpen(false)}>Films</NavLink>
      <NavLink className="nav-link" to="/todos" onClick={() => setOpen(false)}>Todos</NavLink>
      <NavLink className="nav-link" to="/contact" onClick={() => setOpen(false)}>Contact</NavLink>
    </div></div>
  </div></nav>;
}
export default Navbar;
