import { useState, useEffect } from "react";
import Field from "./Field.jsx";
import { getRisk } from "../api.js";
import RiskBadge from "./RiskBadge.jsx";

const EMPTY = { customer: "", amount: "", method: "UPI", category: "", note: "" };
const METHODS = ["UPI", "Card", "Net Banking"];
const CATEGORIES = ["Shopping", "Food", "Travel", "Bills", "Transfer"];

// Used for both Create and Update: `editing` is the record being edited (or null)
export default function TransactionForm({ editing, onSave, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  // When "Edit" is clicked, load that record into the form
  useEffect(() => {
    setForm(editing ? { ...editing, amount: String(editing.amount) } : EMPTY);
    setErrors({});
  }, [editing]);

  // One handler for every input (text, number, radio, select)
  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  }

  function validate() {
    const e = {};
    if (form.customer.trim().length < 2) e.customer = "Enter a name (2+ characters).";
    if (!(Number(form.amount) > 0)) e.amount = "Enter an amount above ₹0.";
    if (!form.category) e.category = "Choose a category.";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate();
    if (Object.keys(found).length) return setErrors(found);
    onSave({
      ...form,
      customer: form.customer.trim(),
      note: form.note.trim(),
      amount: Number(form.amount),
    });
    if (!editing) setForm(EMPTY);
  }

  const amount = Number(form.amount);

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h2>{editing ? "✏️ Update transaction" : "➕ Add transaction"}</h2>

      <Field label="Customer name" error={errors.customer}>
        <input className="input" name="customer" value={form.customer} onChange={handleChange} placeholder="e.g. Asha Rao" />
      </Field>

      <Field label="Amount (₹)" error={errors.amount}>
        <input className="input" name="amount" type="number" min="1" value={form.amount} onChange={handleChange} placeholder="e.g. 25000" />
      </Field>
      {amount > 0 && (
        <p className="preview">Risk preview: <RiskBadge level={getRisk(amount)} /></p>
      )}

      <Field label="Payment method">
        <div className="radios">
          {METHODS.map((m) => (
            <label key={m} className={"radio" + (form.method === m ? " on" : "")}>
              <input type="radio" name="method" value={m} checked={form.method === m} onChange={handleChange} />
              {m}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Category" error={errors.category}>
        <select className="input" name="category" value={form.category} onChange={handleChange}>
          <option value="">Select a category…</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </Field>

      <Field label="Note (optional)">
        <input className="input" name="note" value={form.note} onChange={handleChange} placeholder="Merchant or description" />
      </Field>

      <div className="btn-row">
        <button type="submit" className="btn btn-primary">{editing ? "Save changes" : "Add transaction"}</button>
        {editing && <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
