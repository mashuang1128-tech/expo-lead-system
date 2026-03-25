"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { customerTypes, productOptions } from "@/lib/form-options";

type FormState = {
  fullName: string;
  companyName: string;
  country: string;
  email: string;
  whatsapp: string;
  interestedProducts: string[];
  customerType: string;
};

type LeadCaptureFormProps = {
  submitLabel?: string;
  showBackHomeButton?: boolean;
  compact?: boolean;
};

const initialState: FormState = {
  fullName: "",
  companyName: "",
  country: "",
  email: "",
  whatsapp: "",
  interestedProducts: [],
  customerType: ""
};

export default function LeadCaptureForm({
  submitLabel = "Submit Request",
  showBackHomeButton = false,
  compact = false
}: LeadCaptureFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleProductChange = (product: string) => {
    setFormData((current) => {
      const exists = current.interestedProducts.includes(product);
      return {
        ...current,
        interestedProducts: exists
          ? current.interestedProducts.filter((item) => item !== product)
          : [...current.interestedProducts, product]
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit your request.");
      }

      router.push("/success");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to submit your request.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className={`lead-form${compact ? " lead-form-compact" : ""}`}
      onSubmit={handleSubmit}
    >
      <div className="field-group">
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Your full name"
          value={formData.fullName}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="field-group">
        <label htmlFor="companyName">Company Name</label>
        <input
          id="companyName"
          name="companyName"
          type="text"
          placeholder="Company / Organization name"
          value={formData.companyName}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="field-group">
        <label htmlFor="country">Country</label>
        <input
          id="country"
          name="country"
          type="text"
          placeholder="Country"
          value={formData.country}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="field-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="name@company.com"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="field-group">
        <label htmlFor="whatsapp">WhatsApp</label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          placeholder="+1 234 567 890"
          value={formData.whatsapp}
          onChange={handleInputChange}
          required
        />
      </div>

      <fieldset className="field-group">
        <legend>Interested Product</legend>
        <div className="choice-grid">
          {productOptions.map((product) => (
            <label className="choice-card" key={product}>
              <input
                type="checkbox"
                checked={formData.interestedProducts.includes(product)}
                onChange={() => handleProductChange(product)}
              />
              <span>{product}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field-group">
        <label htmlFor="customerType">Customer Type</label>
        <select
          id="customerType"
          name="customerType"
          value={formData.customerType}
          onChange={handleInputChange}
          required
        >
          <option value="" disabled>
            Select customer type
          </option>
          {customerTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="submit-hint">Takes less than 30 seconds</div>

      <div className="form-actions">
        {showBackHomeButton ? (
          <Link className="button button-secondary" href="/">
            Back Home
          </Link>
        ) : null}
        <button className="button button-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : submitLabel}
        </button>
      </div>

      {submitError ? <p className="form-error">{submitError}</p> : null}
    </form>
  );
}
