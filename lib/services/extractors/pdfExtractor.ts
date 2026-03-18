import { ExtractionResult } from "@/lib/types";

export async function extractTextFromPDF(
  buffer: Buffer,
): Promise<ExtractionResult> {
  try {
    const pdf = await import("pdf-parse");
    const data = await pdf.default(buffer);

    if (data.text && data.text.trim().length > 0) {
      return {
        text: data.text,
        extractedFrom: "text",
      };
    }

    return {
      text: "",
      extractedFrom: "text",
    };
  } catch (error) {
    const shouldLog =
      process.env.DOCSORT_DEBUG === "1" || process.env.EXTRACTOR_DEBUG === "1";
    if (shouldLog) {
      console.error(
        "[extractors/pdf] pdf-parse failed; continuing with empty text",
        error,
      );
    }

    // pdf-parse can fail on some PDFs (e.g., malformed objects). Extraction is best-effort.
    // Returning empty text keeps uploads reliable and avoids noisy errors.
    return {
      text: "",
      extractedFrom: "text",
    };
  }
}
