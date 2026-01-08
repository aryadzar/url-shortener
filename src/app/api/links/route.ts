import { getLinks } from "@/actions/links";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("limit") || "10");
  const q = searchParams.get("q") || "";

  const result = await getLinks({ page, pageSize, q });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  return NextResponse.json({
    data: result.links,
    total: result.total,
    page,
    limit: pageSize,
  });
}

