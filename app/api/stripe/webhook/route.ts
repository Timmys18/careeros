import { NextResponse } from "next/server";
import { handleStripeWebhook } from "@/lib/payments";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }
    const result = await handleStripeWebhook(body, signature);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
