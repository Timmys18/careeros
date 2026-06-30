import { mkdir, writeFile } from "fs/promises";
import path from "path";
import mammoth from "mammoth";
import { prisma } from "@/lib/prisma";
import { getEnvInt } from "@/lib/utils";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function ensureUploadDir() {
  await mkdir(UPLOAD_DIR, { recursive: true });
}

export async function extractTextFromFile(
  buffer: Buffer,
  mimeType: string,
  filename: string,
): Promise<string> {
  if (mimeType === "text/plain" || filename.endsWith(".txt")) {
    return buffer.toString("utf-8");
  }

  if (mimeType === "application/pdf" || filename.endsWith(".pdf")) {
    const pdfParseModule = await import("pdf-parse");
    const pdfParse = "default" in pdfParseModule ? pdfParseModule.default : pdfParseModule;
    const data = await (pdfParse as (buf: Buffer) => Promise<{ text: string }>)(buffer);
    return data.text;
  }

  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    filename.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error("Unsupported file type");
}

export async function saveUploadedFile(
  file: File,
  userId?: string,
): Promise<{ fileId: string; extractedText: string; status: "ok" | "parse_failed" }> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large. Max 10MB.");
  }

  await ensureUploadDir();
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileId = crypto.randomUUID();
  const ext = path.extname(file.name) || ".bin";
  const storagePath = path.join(UPLOAD_DIR, `${fileId}${ext}`);
  await writeFile(storagePath, buffer);

  let extractedText = "";
  let status: "ok" | "parse_failed" = "ok";

  try {
    extractedText = await extractTextFromFile(buffer, file.type, file.name);
    const maxChars = getEnvInt("MAX_RESUME_CHARS", 20000);
    extractedText = extractedText.slice(0, maxChars);
  } catch {
    status = "parse_failed";
  }

  await prisma.uploadedFile.create({
    data: {
      id: fileId,
      userId,
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      storagePath,
      extractedText: extractedText || null,
    },
  });

  return { fileId, extractedText, status };
}
