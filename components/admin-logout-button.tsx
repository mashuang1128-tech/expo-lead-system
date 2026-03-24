"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST"
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Logout failed.");
      }

      router.replace("/admin/login");
      router.refresh();
    } catch (logoutError) {
      setError(
        logoutError instanceof Error
          ? logoutError.message
          : "Logout failed."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <button
        className="button button-secondary"
        type="button"
        onClick={() => void handleLogout()}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Logging out..." : "Logout"}
      </button>
      {error ? <p role="alert">{error}</p> : null}
    </div>
  );
}
