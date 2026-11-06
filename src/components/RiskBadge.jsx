// Reusable risk pill: Low / Medium / High
export default function RiskBadge({ level }) {
  return <span className={"pill pill-" + level.toLowerCase()}>{level}</span>;
}
