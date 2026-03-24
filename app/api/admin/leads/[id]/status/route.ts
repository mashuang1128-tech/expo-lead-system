import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { leadStatuses, type LeadStatus } from "@/lib/lead-status";

type UpdateStatusPayload = {
  status?: LeadStatus;
};

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const body = (await request.json()) as UpdateStatusPayload;
    const nextStatus = body.status;

    if (!nextStatus || !leadStatuses.includes(nextStatus)) {
      return NextResponse.json(
        {
          error: "Invalid lead status.",
          debug: {
            leadId: id,
            nextStatus: nextStatus ?? "New",
            supabaseError: null
          }
        },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    console.log("[LeadStatusAPI] updating lead", {
      leadId: id,
      nextStatus
    });

    const { data, error } = await supabase
      .from("leads")
      .update({ status: nextStatus })
      .eq("id", id)
      .select("id, status")
      .single();

    console.log("[LeadStatusAPI] update result", {
      leadId: id,
      nextStatus,
      supabaseError: error?.message ?? null,
      data
    });

    if (error) {
      return NextResponse.json(
        {
          error: "Status update failed. Supabase returned an error.",
          debug: {
            leadId: id,
            nextStatus,
            supabaseError: error.message
          }
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          error: "Status update failed. No lead matched the provided id.",
          debug: {
            leadId: id,
            nextStatus,
            supabaseError: null
          }
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      debug: {
        leadId: id,
        nextStatus,
        supabaseError: null,
        updatedLeadId: data.id,
        updatedStatus: data.status
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    console.error("[LeadStatusAPI] unexpected error", {
      leadId: id,
      supabaseError: message
    });

    return NextResponse.json(
      {
        error: "Unable to update status right now.",
        debug: {
          leadId: id,
          nextStatus: "New",
          supabaseError: message
        }
      },
      { status: 500 }
    );
  }
}
