import Link from "next/link";
import { notFound } from "next/navigation";
import AdminStatusSelect from "@/components/admin-status-select";
import Tag from "@/components/tag";
import StatusBadge from "@/components/status-badge";
import AdminLogoutButton from "@/components/admin-logout-button";
import { getLeadById } from "@/lib/admin-leads";

export const dynamic = "force-dynamic";

type LeadDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;

  try {
    const lead = await getLeadById(id);

    return (
      <main className="admin-shell">
        <section className="admin-card detail-card">
          <div className="admin-header">
            <div>
              <span className="eyebrow">Lead Detail</span>
              <h1>{lead.full_name}</h1>
              <p>Review the submitted lead information and update the current follow-up status.</p>
            </div>
            <div className="admin-header-actions">
              <Link className="button button-secondary" href="/admin/leads">
                Back to Leads
              </Link>
              <AdminLogoutButton />
            </div>
          </div>

          <div className="detail-priority-grid">
            <div className="priority-card">
              <span>Customer Type</span>
              <Tag tone="customer">{lead.customer_type}</Tag>
            </div>
            <div className="priority-card">
              <span>Country</span>
              <Tag tone="country">{lead.country}</Tag>
            </div>
            <div className="priority-card priority-card-wide">
              <span>Interested Products</span>
              <div className="tag-group">
                {lead.interested_products.length > 0 ? (
                  lead.interested_products.map((product) => (
                    <Tag key={product} tone="accent">
                      {product}
                    </Tag>
                  ))
                ) : (
                  <Tag tone="neutral">No Product</Tag>
                )}
              </div>
            </div>
            <div className="priority-card status-priority-card">
              <span>Current Status</span>
              <StatusBadge status={lead.status} />
            </div>
          </div>

          <div className="detail-grid">
            <div className="detail-item detail-item-emphasis">
              <span>Status Management</span>
              <AdminStatusSelect
                leadId={id}
                initialStatus={lead.status}
                saveMode="manual"
              />
            </div>
            <div className="detail-item">
              <span>Full Name</span>
              <strong>{lead.full_name}</strong>
            </div>
            <div className="detail-item">
              <span>Company Name</span>
              <strong>{lead.company_name}</strong>
            </div>
            <div className="detail-item">
              <span>Email</span>
              <strong>{lead.email}</strong>
            </div>
            <div className="detail-item">
              <span>WhatsApp</span>
              <strong>{lead.whatsapp}</strong>
            </div>
            <div className="detail-item">
              <span>Customer Type</span>
              <strong>{lead.customer_type}</strong>
            </div>
            <div className="detail-item">
              <span>Country</span>
              <strong>{lead.country}</strong>
            </div>
            <div className="detail-item detail-item-wide">
              <span>Interested Products</span>
              <div className="tag-group">
                {lead.interested_products.length > 0 ? (
                  lead.interested_products.map((product) => (
                    <Tag key={product} tone="accent">
                      {product}
                    </Tag>
                  ))
                ) : (
                  <Tag tone="neutral">No Product</Tag>
                )}
              </div>
            </div>
            <div className="detail-item">
              <span>Created At</span>
              <strong>{formatDate(lead.created_at)}</strong>
            </div>
          </div>
        </section>
      </main>
    );
  } catch {
    notFound();
  }
}
