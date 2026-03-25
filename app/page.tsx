import LeadCaptureForm from "@/components/lead-capture-form";

export default function HomePage() {
  return (
    <main className="page-shell landing-shell">
      <section className="hero-card landing-card">
        <div className="landing-copy-block">
          <span className="eyebrow">Exhibition Lead Capture</span>
          <h1>Get Product Details &amp; Business Opportunity</h1>
          <p className="hero-copy">
            Leave your contact to receive:
          </p>
          <ul className="offer-list">
            <li>Full product catalog (PDF)</li>
            <li>Pricing &amp; cooperation model</li>
            <li>One-on-one follow-up after the event</li>
          </ul>
          <p className="landing-note">
            We will contact you shortly after the exhibition.
          </p>
        </div>

        <div className="landing-form-panel">
          <LeadCaptureForm submitLabel="Submit Now" compact />
        </div>
      </section>
    </main>
  );
}
