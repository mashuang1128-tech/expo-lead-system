import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-session";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    sameSite: "lax"
  });

  return response;
}
