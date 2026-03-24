import { NextResponse } from "next/server";
import { ADMIN_PASSWORD } from "@/lib/admin-auth";
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from "@/lib/admin-session";

type LoginPayload = {
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginPayload;

    if (!body.password) {
      return NextResponse.json(
        { error: "Please enter password." },
        { status: 400 }
      );
    }

    if (body.password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE, {
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax"
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Unable to log in right now." },
      { status: 500 }
    );
  }
}
