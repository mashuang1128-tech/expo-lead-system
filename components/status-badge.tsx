import { type LeadStatus } from "@/lib/lead-status";

type StatusBadgeProps = {
  status: LeadStatus;
};

const statusClassMap: Record<LeadStatus, string> = {
  New: "status-badge status-badge-new",
  Contacted: "status-badge status-badge-contacted",
  Quoted: "status-badge status-badge-quoted",
  Won: "status-badge status-badge-won",
  Lost: "status-badge status-badge-lost"
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={statusClassMap[status]}>{status}</span>;
}
