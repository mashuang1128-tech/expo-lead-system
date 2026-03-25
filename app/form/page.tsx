"use client";

import LeadCaptureForm from "@/components/lead-capture-form";

export default function FormPage() {
  return (
    <main className="page-shell">
      <section className="form-card">
        <div className="section-head">
          <span className="eyebrow">Product Request</span>
          <h1>Request Product Information</h1>
          <p>
            Share your contact details and product interests. Our team will send
            the relevant catalog and product information after review.
          </p>
        </div>

        <LeadCaptureForm showBackHomeButton />
      </section>
    </main>
  );
}
