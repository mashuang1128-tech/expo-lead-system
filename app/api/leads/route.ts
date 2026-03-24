import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type LeadPayload = {
  fullName?: string;
  companyName?: string;
  country?: string;
  email?: string;
  whatsapp?: string;
  interestedProducts?: string[];
  customerType?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadPayload;

    if (
      !body.fullName ||
      !body.companyName ||
      !body.country ||
      !body.email ||
      !body.whatsapp ||
      !body.customerType
    ) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("leads").insert({
      full_name: body.fullName,
      company_name: body.companyName,
      country: body.country,
      email: body.email,
      whatsapp: body.whatsapp,
      interested_products: body.interestedProducts ?? [],
      customer_type: body.customerType
    });

    if (error) {
      return NextResponse.json(
        {
          error:
            "Database write failed. Please check the Supabase anon key and insert policy."
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to submit right now. Please try again later." },
      { status: 500 }
    );
  }
}
