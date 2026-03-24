import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <span className="eyebrow">Surgical Energy Solutions</span>
        <h1>Advanced Surgical Energy Solutions</h1>
        <p className="hero-copy">
          Leave your contact to receive product catalog and product information.
        </p>

        <div className="highlight-grid">
          <article className="highlight-item">
            <strong>Exhibition Ready</strong>
            <p>Built for fast lead capture during busy trade shows and professional events.</p>
          </article>
          <article className="highlight-item">
            <strong>Professional Positioning</strong>
            <p>Clear product-oriented messaging that fits modern B2B device conversations.</p>
          </article>
          <article className="highlight-item">
            <strong>Quick Follow-Up</strong>
            <p>Collect buyer information now and support catalog delivery after the event.</p>
          </article>
        </div>

        <div className="hero-actions">
          <Link className="button button-primary" href="/form">
            Get Product Info
          </Link>
        </div>
      </section>
    </main>
  );
}
