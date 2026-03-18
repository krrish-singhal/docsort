import { DocumentCategory, ClassificationResult } from "@/lib/types";
import Groq from "groq-sdk";

const CLASSIFICATION_PROMPT = `You are a document classification expert.

Classify the provided document into exactly one of these categories:
- Documents
- Invoices
- Finance
- Medical Reports
- Legal
- Academic
- Personal
- Others

Return STRICT JSON ONLY (no markdown, no extra text) in this format:
{"category":"<one of the categories>","confidence":0.0,"reasoning":"short reason"}

Rules:
- confidence must be a number between 0 and 1
- If the text is too short/noisy or ambiguous, choose "Others" with confidence <= 0.55
- Prefer "Invoices" for invoice-number/tax-invoice documents; prefer "Finance" for bank statements and receipts
- Prefer "Legal" for contracts/terms/clauses/parties/effective-date/governing-law style documents`;

const VALID_CATEGORIES: DocumentCategory[] = [
  "Documents",
  "Invoices",
  "Finance",
  "Medical Reports",
  "Legal",
  "Academic",
  "Personal",
  "Others",
];

function clampConfidence(value: unknown): number {
  const num = typeof value === "number" ? value : Number.NaN;
  if (!Number.isFinite(num)) return 0.5;
  return Math.max(0, Math.min(1, num));
}

function normalizeCategory(value: unknown): DocumentCategory {
  if (typeof value !== "string") return "Others";
  const lower = value.trim().toLowerCase();

  const exact = VALID_CATEGORIES.find((c) => c.toLowerCase() === lower);
  if (exact) return exact;

  // Common synonyms
  if (lower.includes("receipt")) return "Finance";
  if (lower.includes("invoice")) return "Invoices";
  if (lower.includes("document") || lower.includes("general"))
    return "Documents";
  if (lower.includes("medical")) return "Medical Reports";
  if (
    lower.includes("agreement") ||
    lower.includes("contract") ||
    lower.includes("nda")
  )
    return "Legal";
  if (lower.includes("legal") || lower.includes("court")) return "Legal";
  if (
    lower.includes("academic") ||
    lower.includes("university") ||
    lower.includes("transcript")
  )
    return "Academic";
  if (lower.includes("personal")) return "Personal";
  if (
    lower.includes("other") ||
    lower.includes("unknown") ||
    lower.includes("unclear")
  )
    return "Others";

  return "Others";
}

function parseAiJson(responseTextRaw: string): {
  category: DocumentCategory;
  confidence: number;
  reasoning?: string;
} {
  const raw = responseTextRaw.trim();

  // Try direct JSON first
  try {
    const parsed = JSON.parse(raw) as any;
    return {
      category: normalizeCategory(parsed?.category),
      confidence: clampConfidence(parsed?.confidence),
      reasoning:
        typeof parsed?.reasoning === "string" ? parsed.reasoning : undefined,
    };
  } catch {
    // Try to extract a JSON object substring
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]) as any;
        return {
          category: normalizeCategory(parsed?.category),
          confidence: clampConfidence(parsed?.confidence),
          reasoning:
            typeof parsed?.reasoning === "string"
              ? parsed.reasoning
              : undefined,
        };
      } catch {
        // fall through
      }
    }
  }

  // Last resort heuristic
  return {
    category: normalizeCategory(raw),
    confidence: 0.5,
    reasoning: "Non-JSON AI response; normalized heuristically",
  };
}

function debugLog(...args: unknown[]) {
  if (process.env.CLASSIFIER_DEBUG === "1") {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
}

function uniqueStrings(values: Array<string | undefined | null>): string[] {
  const out: string[] = [];
  for (const v of values) {
    if (!v) continue;
    const trimmed = v.trim();
    if (!trimmed) continue;
    if (!out.includes(trimmed)) out.push(trimmed);
  }
  return out;
}

function isModelError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return (
    msg.toLowerCase().includes("model") ||
    msg.toLowerCase().includes("decommission")
  );
}

function fallbackResult(reasoning: string): ClassificationResult {
  return {
    category: "Others",
    confidence: 0.5,
    mode: "ai",
    reasoning,
  };
}

export async function classifyWithAI(
  text: string,
): Promise<ClassificationResult> {
  const apiKey = process.env.GROQ_API_KEY;

  // If Groq isn't configured, silently fall back.
  if (!apiKey) return fallbackResult("AI disabled (GROQ_API_KEY not set)");

  try {
    const client = new Groq({ apiKey });

    // Truncate text to avoid exceeding token limits
    const truncatedText = text.slice(0, 5000);

    const modelsToTry = uniqueStrings([
      process.env.GROQ_MODEL,
      // Current Groq defaults (avoid decommissioned models)
      "llama-3.1-8b-instant",
      "llama-3.1-70b-versatile",
      // Back-compat fallbacks
      "llama3-8b-8192",
      "llama3-70b-8192",
    ]);

    let lastError: unknown = null;
    for (const model of modelsToTry) {
      try {
        debugLog("[classifier] Groq model attempt:", model);
        const completion = await client.chat.completions.create({
          model,
          max_tokens: 160,
          temperature: 0,
          messages: [
            {
              role: "user",
              content: `${CLASSIFICATION_PROMPT}\n\nDocument text:\n${truncatedText}`,
            },
          ],
        });

        const responseText =
          completion.choices?.[0]?.message?.content?.trim() ?? "";
        const parsed = parseAiJson(responseText);
        const category = parsed.confidence <= 0.55 ? "Others" : parsed.category;
        const confidence = clampConfidence(parsed.confidence);

        return {
          category,
          confidence,
          mode: "ai",
          reasoning: parsed.reasoning ?? `Groq classified as ${category}`,
        };
      } catch (err) {
        lastError = err;
        // If the model itself is the problem, try the next one.
        if (isModelError(err)) continue;

        // Non-model errors (rate limits, connectivity, etc.) shouldn't spam retries.
        break;
      }
    }

    const msg =
      lastError instanceof Error ? lastError.message : "Unknown error";
    return fallbackResult(`AI fallback (${msg})`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return fallbackResult(`AI fallback (${msg})`);
  }
}
