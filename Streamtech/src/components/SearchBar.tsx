interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}
function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  return (
    <>
      <label htmlFor="movie-search" className="form-label">
        Rechercher un film
      </label>
      <input
        id="movie-search"
        type="search"
        className="form-control"
        placeholder="Rechercher un film..."
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </>
  );
}
export default SearchBar;
