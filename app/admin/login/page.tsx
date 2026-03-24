"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ADMIN_COOKIE_NAME,
  isAdminAuthenticated
} from "@/lib/admin-session";

function getCookieValue(name: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));

  return cookie ? cookie.split("=")[1] : null;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const cookieValue = getCookieValue(ADMIN_COOKIE_NAME);

    if (isAdminAuthenticated(cookieValue)) {
      const redirectPath = searchParams.get("redirect");
      const targetPath =
        redirectPath && redirectPath.startsWith("/admin")
          ? redirectPath
          : "/admin/leads";

      router.replace(targetPath);
    }
  }, [router, searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Login failed.");
      }

      const redirectPath = searchParams.get("redirect");
      const targetPath =
        redirectPath && redirectPath.startsWith("/admin")
          ? redirectPath
          : "/admin/leads";

      router.replace(targetPath);
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Login failed."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="form-card">
        <div className="section-head">
          <span className="eyebrow">Admin Access</span>
          <h1>Admin Login</h1>
          <p>Enter the admin password to access the leads dashboard.</p>
        </div>

        <form className="lead-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="adminPassword">Password</label>
            <input
              id="adminPassword"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              required
            />
          </div>

          <div className="form-actions">
            <button className="button button-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </div>

          {error ? <p role="alert">{error}</p> : null}
        </form>
      </section>
    </main>
  );
}
