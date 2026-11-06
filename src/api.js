// All JSON Server (REST) calls live here: GET, POST, PUT, DELETE.
const URL = "http://localhost:3001/transactions";

async function request(url, options) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error("Request failed (" + res.status + ")");
  return res.status === 204 ? null : res.json();
}

export const getTransactions = () => request(URL + "?_sort=id&_order=desc");
export const createTransaction = (data) =>
  request(URL, { method: "POST", body: JSON.stringify(data) });
export const updateTransaction = (id, data) =>
  request(URL + "/" + id, { method: "PUT", body: JSON.stringify(data) });
export const deleteTransaction = (id) => request(URL + "/" + id, { method: "DELETE" });

// Same rules as the Part 1 demo
export function getRisk(amount) {
  if (amount >= 100000) return "High";
  if (amount >= 50000) return "Medium";
  return "Low";
}
