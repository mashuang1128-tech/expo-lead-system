import Link from "next/link";
import { WEBSITE_URL } from "@/lib/site-config";

export default function SuccessPage() {
  return (
    <main className="page-shell">
      <section className="success-card">
        <span className="success-badge">Request Submitted</span>
        <h1>Thank You!</h1>
        <p>
          Your request has been submitted successfully. Our team will review
          your information and contact you shortly.
        </p>

        <div className="success-panel">
          <div>
            <strong>What Happens Next</strong>
            <p>
              Our sales team will review your request and prepare the most
              relevant product information for follow-up.
            </p>
          </div>
          <div>
            <strong>More Information</strong>
            <p>
              You can download our product catalog or visit our website for
              more information.
            </p>
          </div>
        </div>

        <div className="hero-actions">
          <Link className="button button-primary" href="/catalog.pdf">
            Download Catalog
          </Link>
          <Link
            className="button button-secondary"
            href={WEBSITE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Website
          </Link>
        </div>
      </section>
    </main>
  );
}
