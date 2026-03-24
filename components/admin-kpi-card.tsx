type AdminKpiCardProps = {
  label: string;
  value: number;
  helper: string;
  tone?: "default" | "featured" | "progress" | "muted";
};

const toneClassMap = {
  default: "kpi-card",
  featured: "kpi-card kpi-card-featured",
  progress: "kpi-card kpi-card-progress",
  muted: "kpi-card kpi-card-muted"
} as const;

export default function AdminKpiCard({
  label,
  value,
  helper,
  tone = "default"
}: AdminKpiCardProps) {
  return (
    <article className={toneClassMap[tone]}>
      <span className="kpi-label">{label}</span>
      <strong className="kpi-value">{value}</strong>
      <p className="kpi-helper">{helper}</p>
    </article>
  );
}
