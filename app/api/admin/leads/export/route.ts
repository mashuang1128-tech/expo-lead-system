import { NextResponse } from "next/server";
import { getLeadsForExport } from "@/lib/admin-leads";

function escapeCsvCell(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

function buildCsv(rows: Array<Record<string, string>>) {
  const headers = [
    "full_name",
    "company_name",
    "country",
    "email",
    "whatsapp",
    "interested_products",
    "customer_type",
    "status",
    "created_at"
  ];

  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((header) => escapeCsvCell(row[header] ?? "")).join(",")
    )
  ];

  return `\uFEFF${lines.join("\n")}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const keyword = searchParams.get("q") ?? undefined;
    const country = searchParams.get("country") ?? undefined;
    const customerType = searchParams.get("customer_type") ?? undefined;
    const status = searchParams.get("status") ?? undefined;

    const leads = await getLeadsForExport({
      keyword,
      country,
      customerType,
      status
    });

    const csv = buildCsv(
      leads.map((lead) => ({
        full_name: lead.full_name,
        company_name: lead.company_name,
        country: lead.country,
        email: lead.email,
        whatsapp: lead.whatsapp,
        interested_products: lead.interested_products.join(", "),
        customer_type: lead.customer_type,
        status: lead.status,
        created_at: lead.created_at
      }))
    );

    const exportDate = new Date().toISOString().slice(0, 10);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="leads-export-${exportDate}.csv"`
      }
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to export leads." },
      { status: 500 }
    );
  }
}
