import { NextRequest, NextResponse } from "next/server";
import { kratosClient } from "@/lib/kratos/client";

export async function GET(request: NextRequest) {
  const cookie = request.headers.get("cookie") || "";

  try {
    const { data } = await kratosClient.createBrowserLogoutFlow({
      cookie,
    });

    return NextResponse.redirect(data.logout_url);
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
