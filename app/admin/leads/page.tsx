import Link from "next/link";
import { getLeadFilterOptions, getLeads } from "@/lib/admin-leads";
import AdminStatusSelect from "@/components/admin-status-select";
import Tag from "@/components/tag";
import AdminLogoutButton from "@/components/admin-logout-button";
import AdminKpiCard from "@/components/admin-kpi-card";

export const dynamic = "force-dynamic";

type LeadsPageProps = {
  searchParams: Promise<{
    q?: string;
    country?: string;
    customer_type?: string;
    status?: string;
  }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export default async function AdminLeadsPage({ searchParams }: LeadsPageProps) {
  const params = await searchParams;
  const keyword = params.q ?? "";
  const country = params.country ?? "";
  const customerType = params.customer_type ?? "";
  const status = params.status ?? "";
  const exportParams = new URLSearchParams();

  if (keyword) {
    exportParams.set("q", keyword);
  }

  if (country) {
    exportParams.set("country", country);
  }

  if (customerType) {
    exportParams.set("customer_type", customerType);
  }

  if (status) {
    exportParams.set("status", status);
  }

  const exportQuery = exportParams.toString();
  const exportHref = exportQuery
    ? `/api/admin/leads/export?${exportQuery}`
    : "/api/admin/leads/export";

  const [{ countries, customerTypes, statuses }, leads] = await Promise.all([
    getLeadFilterOptions(),
    getLeads({
      keyword: keyword || undefined,
      country: country || undefined,
      customerType: customerType || undefined,
      status: status || undefined
    })
  ]);

  const hasSearchOrFilter = Boolean(keyword || country || customerType || status);
  const totalLeads = leads.length;
  const newLeads = leads.filter((lead) => lead.status === "New").length;
  const contactedLeads = leads.filter((lead) => lead.status === "Contacted").length;
  const otherStatusLeads = leads.filter(
    (lead) => lead.status !== "New" && lead.status !== "Contacted"
  ).length;
  const kpiHelperText = hasSearchOrFilter
    ? "Based on current filtered results"
    : "Based on all visible leads";

  return (
    <main className="admin-shell">
      <section className="admin-card">
        <div className="admin-header">
          <div>
            <span className="eyebrow">Sales Admin</span>
            <h1>Lead Management</h1>
            <p>Review submitted booth leads, filter the pipeline, and update status in one place.</p>
          </div>
          <div className="admin-header-actions">
            <Link className="button button-secondary" href={exportHref}>
              Export CSV
            </Link>
            <Link className="button button-secondary" href="/">
              Back Home
            </Link>
            <AdminLogoutButton />
          </div>
        </div>

        <div className="kpi-grid">
          <AdminKpiCard
            label="Total Leads"
            value={totalLeads}
            helper={kpiHelperText}
          />
          <AdminKpiCard
            label="New Leads"
            value={newLeads}
            helper="Priority for immediate sales follow-up"
            tone="featured"
          />
          <AdminKpiCard
            label="Contacted"
            value={contactedLeads}
            helper="Leads already in initial communication"
            tone="progress"
          />
          <AdminKpiCard
            label="Other Status"
            value={otherStatusLeads}
            helper="Quoted, won, lost, and other progressed records"
            tone="muted"
          />
        </div>

        <form className="filter-form" method="get">
          <div className="filter-item filter-search-item">
            <label htmlFor="q">Search Leads</label>
            <input
              id="q"
              name="q"
              type="text"
              defaultValue={keyword}
              placeholder="Search by full name, company name, email, or WhatsApp"
            />
          </div>

          <div className="filter-item">
            <label htmlFor="country">Country</label>
            <select id="country" name="country" defaultValue={country}>
              <option value="">All Countries</option>
              {countries.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="customer_type">Customer Type</label>
            <select id="customer_type" name="customer_type" defaultValue={customerType}>
              <option value="">All Customer Types</option>
              {customerTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={status}>
              <option value="">All Statuses</option>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-actions">
            <button className="button button-primary" type="submit">
              Search
            </button>
            <Link className="button button-secondary" href="/admin/leads">
              Reset
            </Link>
          </div>
        </form>

        {leads.length === 0 ? (
          <div className="admin-empty-state">
            <div className="empty-state-card">
              <strong>No leads matched your search</strong>
              <p>
                {hasSearchOrFilter
                  ? "Try another keyword or adjust the current filters to find matching leads."
                  : "No leads are available yet. Once submissions arrive, they will appear here."}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mobile-lead-list">
              {leads.map((lead) => (
                <article
                  key={lead.id}
                  className={`mobile-lead-card${lead.status === "New" ? " mobile-lead-card-new" : ""}`}
                >
                  <div className="mobile-lead-card-header">
                    <div className="mobile-lead-card-title">
                      <strong>{lead.full_name}</strong>
                      <span>{lead.company_name}</span>
                    </div>
                    <Tag tone="country">{lead.country}</Tag>
                  </div>

                  <div className="mobile-lead-card-section">
                    <span className="mobile-lead-label">Customer Type</span>
                    <Tag tone="customer">{lead.customer_type}</Tag>
                  </div>

                  <div className="mobile-lead-card-section">
                    <span className="mobile-lead-label">Interested Products</span>
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

                  <div className="mobile-lead-meta">
                    <div>
                      <span className="mobile-lead-label">Email</span>
                      <a className="lead-meta-link" href={`mailto:${lead.email}`}>
                        {lead.email}
                      </a>
                    </div>
                    <div>
                      <span className="mobile-lead-label">WhatsApp</span>
                      <span>{lead.whatsapp}</span>
                    </div>
                    <div>
                      <span className="mobile-lead-label">Created At</span>
                      <span className="created-at-text">{formatDate(lead.created_at)}</span>
                    </div>
                  </div>

                  <div className="mobile-lead-card-section">
                    <AdminStatusSelect
                      leadId={lead.id}
                      initialStatus={lead.status}
                    />
                  </div>

                  <div className="mobile-lead-actions">
                    <Link className="button button-secondary" href={`/admin/leads/${lead.id}`}>
                      View Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="lead-table-wrapper desktop-lead-table">
              <table className="lead-table">
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Country</th>
                    <th>Products</th>
                    <th>Customer Type</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className={`lead-row${lead.status === "New" ? " lead-row-new" : ""}`}
                    >
                      <td>
                        <div className="lead-primary-cell">
                          <strong>{lead.full_name}</strong>
                          <span>{lead.company_name}</span>
                          <a className="lead-meta-link" href={`mailto:${lead.email}`}>
                            {lead.email}
                          </a>
                          <span>{lead.whatsapp}</span>
                        </div>
                      </td>
                      <td>
                        <Tag tone="country">{lead.country}</Tag>
                      </td>
                      <td>
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
                      </td>
                      <td>
                        <Tag tone="customer">{lead.customer_type}</Tag>
                      </td>
                      <td>
                        <AdminStatusSelect
                          leadId={lead.id}
                          initialStatus={lead.status}
                        />
                      </td>
                      <td>
                        <span className="created-at-text">{formatDate(lead.created_at)}</span>
                      </td>
                      <td>
                        <Link className="table-link" href={`/admin/leads/${lead.id}`}>
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
