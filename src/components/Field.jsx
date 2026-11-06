// Reusable labelled input wrapper
export default function Field({ label, error, children }) {
  return (
    <div className="field-wrap">
      <label className="flabel">{label}</label>
      {children}
      <p className="err">{error}</p>
    </div>
  );
}
