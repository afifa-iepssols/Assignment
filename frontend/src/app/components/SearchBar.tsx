interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    onSearch: (term: string) => void;
  }
  
  const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, onSearch }) => {
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(searchTerm);
    };
  
    return (
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <button type="submit" className="bg-sky-800 text-white px-4 rounded">Search</button>
      </form>
    );
  };
  
  export default SearchBar;
  