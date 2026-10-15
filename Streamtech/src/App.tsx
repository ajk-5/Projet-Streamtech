import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Todos from "./pages/Todos";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container py-4 flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/todos" element={<Todos />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="*"
            element={
              <div className="alert alert-warning">
                <h1>404 — Page non trouvée</h1>
                <Link to="/">Revenir aux films</Link>
              </div>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
export default App;
