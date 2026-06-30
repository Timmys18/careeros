import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateReportForProfile } from "@/lib/report-service";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sign in required to generate a report" }, { status: 401 });
    }

    const { profileId } = await req.json();
    if (!profileId) {
      return NextResponse.json({ error: "profileId required" }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const report = await generateReportForProfile(profileId, session.user.id, ip);

    return NextResponse.json({ reportId: report.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 429 });
  }
}
