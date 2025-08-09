import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // TODO: اربط مزود بريد/CRM هنا (Resend, Mailgun, HubSpot...)
    console.log("Contact message:", body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}


