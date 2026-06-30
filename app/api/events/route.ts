import { NextResponse } from "next/server";
import { trackEvent } from "@/lib/analytics";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const { eventName, properties, sessionId } = await req.json();

    if (!eventName || typeof eventName !== "string") {
      return NextResponse.json({ error: "eventName required" }, { status: 400 });
    }

    await trackEvent(eventName, {
      userId: session?.user?.id,
      sessionId,
      properties,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
