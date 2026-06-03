import { API_URL } from "@/lib/const";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const i = searchParams.get("i");
  const theme = searchParams.get("theme") ?? "light";

  if (!i) {
    return new NextResponse("Missing icon id", { status: 400 });
  }

  const url = `${API_URL}/icons?i=${i}&theme=${theme}`;

  const res = await fetch(url, {
    next: { revalidate: 60 * 60 * 24 * 7 }, // 7 days
  });

  if (!res.ok) {
    return new NextResponse("Failed to fetch icon", { status: res.status });
  }

  const svg = await res.text();

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
    },
  });
}