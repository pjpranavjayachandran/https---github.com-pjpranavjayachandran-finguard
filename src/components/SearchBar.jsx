// Bonus: dynamic search + risk filter
export default function SearchBar({ search, setSearch, riskFilter, setRiskFilter }) {
  return (
    <div className="searchbar">
      <input
        className="input"
        type="search"
        placeholder="🔍 Search by customer, note or category…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select className="input" value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
        <option value="All">All risk levels</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
    </div>
  );
}
