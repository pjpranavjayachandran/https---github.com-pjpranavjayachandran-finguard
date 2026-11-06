import RiskBadge from "./RiskBadge.jsx";
import { getRisk } from "../api.js";

export default function TransactionRow({ tx, onEdit, onDelete }) {
  return (
    <li className="row">
      <div className="row-main">
        <p className="row-name">{tx.customer}</p>
        <p className="row-sub">
          {tx.category} · {tx.method}{tx.note ? " · " + tx.note : ""}
        </p>
      </div>
      <div className="row-amt">
        <p>₹{tx.amount.toLocaleString("en-IN")}</p>
        <RiskBadge level={getRisk(tx.amount)} />
      </div>
      <div className="row-actions">
        <button className="icon-btn" onClick={() => onEdit(tx)} aria-label="Edit">✏️</button>
        <button className="icon-btn" onClick={() => onDelete(tx.id)} aria-label="Delete">🗑</button>
      </div>
    </li>
  );
}
