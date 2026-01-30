import { getLinkAnalyticsData } from "@/actions/analytics";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{ key: string }>;
};

export async function GET(req: NextRequest, { params }: Props) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "startDate and endDate are required" },
      { status: 400 },
    );
  }

  const { key } = await params;

  const result = await getLinkAnalyticsData({
    linkKey: key,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  });

  if ("error" in result) {
    if (result.error === "Link not found") {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  return NextResponse.json(result.data);
}
