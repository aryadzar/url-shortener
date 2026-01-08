import { getLinkAndLogClick } from "@/actions/links";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token, key } = await req.json();

  // Verifikasi ke Cloudflare
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY!,
        response: token,
      }),
    }
  );

  const result = await res.json();

  if (!result.success) {
    return NextResponse.json({ error: "Bot detected" }, { status: 403 });
  }

  const link = await getLinkAndLogClick(key);

  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ url: link.url });
}
