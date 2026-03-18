import { ExtractionResult } from "@/lib/types";
import { extractTextFromPDF } from "./pdfExtractor";
import { extractTextFromDOCX } from "./docxExtractor";

export async function extractText(
  buffer: Buffer,
  mimeType: string,
  filename: string,
): Promise<ExtractionResult> {
  // Route to appropriate extractor based on file type
  if (
    mimeType === "application/pdf" ||
    filename.toLowerCase().endsWith(".pdf")
  ) {
    return extractTextFromPDF(buffer);
  }

  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    filename.toLowerCase().endsWith(".docx")
  ) {
    return extractTextFromDOCX(buffer);
  }

  // Plain text files
  if (mimeType.startsWith("text/") || filename.toLowerCase().endsWith(".txt")) {
    return {
      text: buffer.toString("utf-8"),
      extractedFrom: "text",
    };
  }

  const shouldLog =
    process.env.DOCSORT_DEBUG === "1" || process.env.EXTRACTOR_DEBUG === "1";
  if (shouldLog) {
    console.warn(
      "[extractors] unsupported file type for text extraction; continuing with empty text",
      {
        mimeType,
        filename,
      },
    );
  }

  return {
    text: "",
    extractedFrom: "text",
  };
}
