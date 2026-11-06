import { useState, useEffect } from "react";
import * as api from "./api.js";
import StatCard from "./components/StatCard.jsx";
import SearchBar from "./components/SearchBar.jsx";
import TransactionForm from "./components/TransactionForm.jsx";
import TransactionRow from "./components/TransactionRow.jsx";

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // READ — load all records once when the app starts
  useEffect(() => {
    api.getTransactions()
      .then(setTransactions)
      .catch(() => setError("Cannot reach JSON Server. Run: npm run dev"))
      .finally(() => setLoading(false));
  }, []);

  // CREATE or UPDATE
  async function handleSave(data) {
    try {
      if (editing) {
        const updated = await api.updateTransaction(editing.id, { ...editing, ...data });
        setTransactions(transactions.map((t) => (t.id === updated.id ? updated : t)));
        setEditing(null);
      } else {
        const created = await api.createTransaction({ ...data, createdAt: new Date().toISOString() });
        setTransactions([created, ...transactions]);
      }
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }

  // DELETE
  async function handleDelete(id) {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await api.deleteTransaction(id);
      setTransactions(transactions.filter((t) => t.id !== id));
      if (editing && editing.id === id) setEditing(null);
    } catch (e) {
      setError(e.message);
    }
  }

  // SEARCH + FILTER (derived from state, no extra state needed)
  const q = search.trim().toLowerCase();
  const visible = transactions.filter((t) => {
    const text = (t.customer + " " + t.note + " " + t.category + " " + t.method).toLowerCase();
    const riskOk = riskFilter === "All" || api.getRisk(t.amount) === riskFilter;
    return text.includes(q) && riskOk;
  });

  const count = (level) => transactions.filter((t) => api.getRisk(t.amount) === level).length;

  return (
    <>
      <header className="header">
        <div className="logo">🛡</div>
        <div>
          <h1>FinGuard AI</h1>
          <p>Transaction Monitor · CRUD with React</p>
        </div>
      </header>

      <main className="container">
        <section className="stats">
          <StatCard label="Total" value={transactions.length} color="#6D4AFF" />
          <StatCard label="Low risk" value={count("Low")} color="#12C79A" />
          <StatCard label="Medium risk" value={count("Medium")} color="#FFB938" />
          <StatCard label="High risk" value={count("High")} color="#FF5D73" />
        </section>

        {error && <div className="error">⚠️ {error}</div>}

        <div className="layout">
          <TransactionForm editing={editing} onSave={handleSave} onCancel={() => setEditing(null)} />

          <section className="card">
            <h2>📋 Transactions</h2>
            <SearchBar search={search} setSearch={setSearch} riskFilter={riskFilter} setRiskFilter={setRiskFilter} />
            {loading ? (
              <p className="empty">Loading…</p>
            ) : visible.length === 0 ? (
              <p className="empty">No transactions found.</p>
            ) : (
              <ul className="list">
                {visible.map((t) => (
                  <TransactionRow key={t.id} tx={t} onEdit={setEditing} onDelete={handleDelete} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>

      <footer className="footer">© 2026 FinGuard AI · Developed by Pranav Jayachandran</footer>
    </>
  );
}
