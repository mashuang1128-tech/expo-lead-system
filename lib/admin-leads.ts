import { createSupabaseServerClient } from "@/lib/supabase-server";
import { leadStatuses, type LeadStatus } from "@/lib/lead-status";

export type LeadRecord = {
  id: string;
  full_name: string;
  company_name: string;
  country: string;
  email: string;
  whatsapp: string;
  interested_products: string[];
  customer_type: string;
  status: LeadStatus;
  created_at: string;
};

export type LeadFilters = {
  country?: string;
  customerType?: string;
  status?: string;
  keyword?: string;
};

export type LeadExportRecord = Omit<LeadRecord, "id">;

export async function getLeadFilterOptions() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("leads")
    .select("country, customer_type");

  if (error) {
    throw new Error("Failed to load lead filter options.");
  }

  const countries = Array.from(
    new Set((data ?? []).map((item) => item.country).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  const customerTypes = Array.from(
    new Set((data ?? []).map((item) => item.customer_type).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  return {
    countries,
    customerTypes,
    statuses: [...leadStatuses]
  };
}

export async function getLeads(filters: LeadFilters = {}) {
  const supabase = createSupabaseServerClient();

  let query = supabase
    .from("leads")
    .select(
      "id, full_name, company_name, country, email, whatsapp, interested_products, customer_type, status, created_at"
    )
    .order("created_at", { ascending: false });

  if (filters.keyword) {
    const keyword = filters.keyword.trim();
    query = query.or(
      `full_name.ilike.%${keyword}%,company_name.ilike.%${keyword}%,email.ilike.%${keyword}%,whatsapp.ilike.%${keyword}%`
    );
  }

  if (filters.country) {
    query = query.eq("country", filters.country);
  }

  if (filters.customerType) {
    query = query.eq("customer_type", filters.customerType);
  }

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Failed to load leads.");
  }

  return (data ?? []) as LeadRecord[];
}

export async function getLeadsForExport(filters: LeadFilters = {}) {
  const supabase = createSupabaseServerClient();

  let query = supabase
    .from("leads")
    .select(
      "full_name, company_name, country, email, whatsapp, interested_products, customer_type, status, created_at"
    )
    .order("created_at", { ascending: false });

  if (filters.keyword) {
    const keyword = filters.keyword.trim();
    query = query.or(
      `full_name.ilike.%${keyword}%,company_name.ilike.%${keyword}%,email.ilike.%${keyword}%,whatsapp.ilike.%${keyword}%`
    );
  }

  if (filters.country) {
    query = query.eq("country", filters.country);
  }

  if (filters.customerType) {
    query = query.eq("customer_type", filters.customerType);
  }

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Failed to export leads.");
  }

  return (data ?? []) as LeadExportRecord[];
}

export async function getLeadById(id: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("leads")
    .select(
      "id, full_name, company_name, country, email, whatsapp, interested_products, customer_type, status, created_at"
    )
    .eq("id", id)
    .single();

  if (error) {
    throw new Error("Failed to load lead details.");
  }

  return data as LeadRecord;
}
