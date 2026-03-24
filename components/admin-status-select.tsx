"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { leadStatuses, type LeadStatus } from "@/lib/lead-status";
import StatusBadge from "@/components/status-badge";

type StatusDebugInfo = {
  leadId: string;
  nextStatus: LeadStatus;
  supabaseError: string | null;
  updatedLeadId?: string;
  updatedStatus?: string;
};

type UpdateStatusResult = {
  success?: boolean;
  error?: string;
  debug?: StatusDebugInfo;
};

type AdminStatusSelectProps = {
  leadId: string;
  initialStatus: LeadStatus;
  saveMode?: "auto" | "manual";
};

export default function AdminStatusSelect({
  leadId,
  initialStatus,
  saveMode = "auto"
}: AdminStatusSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(initialStatus);
  const [savedStatus, setSavedStatus] = useState<LeadStatus>(initialStatus);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [debugMessage, setDebugMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const updateStatus = async (nextStatus: LeadStatus) => {
    const response = await fetch(`/api/admin/leads/${leadId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: nextStatus })
    });

    const result = (await response.json()) as UpdateStatusResult;

    console.log("[AdminStatusSelect] update response", result);

    if (!response.ok) {
      const debugText = result.debug
        ? `leadId=${result.debug.leadId}, status=${result.debug.nextStatus}, supabaseError=${result.debug.supabaseError ?? "null"}`
        : `leadId=${leadId}, status=${nextStatus}, supabaseError=unknown`;

      throw new Error(
        `${result.error || "Failed to update status."} Debug: ${debugText}`
      );
    }

    return result;
  };

  const buildDebugMessage = (debug?: StatusDebugInfo) => {
    if (!debug) {
      return "";
    }

    return `leadId=${debug.leadId}, status=${debug.nextStatus}, supabaseError=${debug.supabaseError ?? "null"}`;
  };

  const handleAutoChange = async (nextStatus: LeadStatus) => {
    setError("");
    setSuccessMessage("");
    setDebugMessage("");
    setStatus(nextStatus);

    try {
      const result = await updateStatus(nextStatus);
      setSavedStatus(nextStatus);
      setSuccessMessage("Status updated successfully");
      setDebugMessage(buildDebugMessage(result.debug));
      startTransition(() => {
        router.refresh();
      });
    } catch (updateError) {
      setStatus(savedStatus);
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update status."
      );
    }
  };

  const handleManualSave = async () => {
    setError("");
    setSuccessMessage("");
    setDebugMessage(`leadId=${leadId}, status=${status}, supabaseError=pending`);

    try {
      const result = await updateStatus(status);
      setSavedStatus(status);
      setSuccessMessage("Status updated successfully");
      setDebugMessage(buildDebugMessage(result.debug));
      startTransition(() => {
        router.refresh();
      });
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update status."
      );
    }
  };

  return (
    <div className="status-control">
      <div className="status-header">
        <span className="status-label">Current Status</span>
        <StatusBadge status={savedStatus} />
      </div>

      <div className="status-actions">
        <select
          className="status-select"
          value={status}
          onChange={(event) => {
            const nextStatus = event.target.value as LeadStatus;
            setStatus(nextStatus);

            if (saveMode === "auto") {
              void handleAutoChange(nextStatus);
            } else {
              setError("");
              setSuccessMessage("");
              setDebugMessage("");
            }
          }}
          disabled={isPending}
        >
          {leadStatuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {saveMode === "manual" ? (
          <button
            className="button button-primary status-save-button"
            type="button"
            onClick={() => void handleManualSave()}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save Status"}
          </button>
        ) : null}
      </div>

      {successMessage ? (
        <p className="status-success">Status updated successfully</p>
      ) : null}
      {error ? <p className="status-error">{error}</p> : null}
      {debugMessage ? <p className="status-debug">{debugMessage}</p> : null}
    </div>
  );
}
