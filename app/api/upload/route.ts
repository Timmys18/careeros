import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/upload";
import { trackEvent, EVENTS } from "@/lib/analytics";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const result = await saveUploadedFile(file, session?.user?.id);

    await trackEvent(EVENTS.RESUME_UPLOADED, {
      userId: session?.user?.id,
      properties: { fileId: result.fileId, status: result.status },
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
