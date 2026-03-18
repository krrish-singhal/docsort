import { DocumentCategory, ClassificationResult } from "@/lib/types";

type RulePatterns = Partial<
  Record<
    DocumentCategory,
    {
      keywords: string[];
      patterns: RegExp[];
    }
  >
>;

const RULE_PATTERNS: RulePatterns = {
  Documents: {
    keywords: ["document", "form", "application", "report"],
    patterns: [],
  },
  Invoices: {
    keywords: [
      "invoice",
      "tax invoice",
      "invoice number",
      "invoice no",
      "invoice date",
      "amount due",
      "bill to",
      "ship to",
      "subtotal",
      "total amount",
      "gstin",
      "hsn",
    ],
    patterns: [
      /tax\s*invoice/i,
      /invoice\s*(number|no\.?|#)\s*[:\-]?\s*[\w\-]+/i,
      /bill\s*to\s*[:\-]/i,
      /amount\s*due\s*[:\-]?/i,
      /due\s*date/i,
      /gstin\s*[:\-]?\s*[0-9A-Z]{10,}/i,
      /total\s*[:\-]?\s*(?:₹|rs\.?|inr|\$)?\s*[\d,.]+/i,
    ],
  },
  Finance: {
    keywords: [
      "bank",
      "account",
      "statement",
      "balance",
      "transaction",
      "deposit",
      "withdrawal",
      "spreadsheet",
      // receipt-like documents are treated as finance
      "receipt",
      "purchase",
      "store",
      "retail",
      "price",
      "item",
      "qty",
    ],
    patterns: [
      /bank\s*statement/i,
      /account\s*statement/i,
      /closing\s*balance/i,
      /debit|credit/i,
    ],
  },
  Receipts: {
    keywords: [
      "receipt",
      "cash memo",
      "tax receipt",
      "pos",
      "terminal",
      "merchant",
      "thank you for shopping",
      "subtotal",
      "total",
      "qty",
      "quantity",
      "change",
      "cash",
      "card",
      "upi",
      "txn",
      "transaction id",
      "gst",
    ],
    patterns: [
      /\b(receipt|cash\s*memo)\b/i,
      /thank\s+you\s+for\s+shopping/i,
      /\bqty\b\s*[:\-]?\s*\d+/i,
      /\btotal\b\s*[:\-]?\s*(?:₹|rs\.?|inr|\$)?\s*[\d,.]+/i,
      /\bupi\b/i,
      /\btxn\b\s*(id|no\.?|#)?/i,
      /\bmerchant\b/i,
    ],
  },
  "Medical Reports": {
    keywords: [
      "medical",
      "medical report",
      "medical certificate",
      "fitness certificate",
      "patient",
      "diagnosis",
      "doctor",
      "dr.",
      "hospital",
      "clinic",
      "prescription",
      "clinical",
      "health",
    ],
    patterns: [
      /medical\s*certificate/i,
      /fitness\s*certificate/i,
      /fit\s*to\s*work/i,
      /unfit\s*to\s*work/i,
      /patient\s*name/i,
      /diagnosis/i,
      /prescription/i,
      /dr\.?\s*[A-Z][a-z]+/,
    ],
  },
  Legal: {
    keywords: [
      "legal",
      "clause",
      "attorney",
      "law",
      "court",
      "defendant",
      "plaintiff",
      // contract / agreement-style docs (previously a separate "Agreements" category)
      "agreement",
      "contract",
      "terms and conditions",
      "terms & conditions",
      "party",
      "parties",
      "effective date",
      "governing law",
      "whereas",
      "hereby",
      "witnesseth",
      "indemnity",
      "confidentiality",
      "non disclosure",
      "non-disclosure",
      "nda",
      "service agreement",
      "employment agreement",
      "lease agreement",
      "rental agreement",
    ],
    patterns: [
      /legal\s*notice/i,
      /court\s*order/i,
      /case\s*no\.?/i,
      /\bagreement\b/i,
      /\bcontract\b/i,
      /terms\s*(and|&)\s*conditions/i,
      /effective\s*date\s*[:\-]?/i,
      /governing\s*law/i,
      /\bwhereas\b/i,
      /\bhereby\b/i,
      /\bwitnesseth\b/i,
      /confidentiality/i,
      /non\s*-?disclosure/i,
      /\bnda\b/i,
      /indemnif(y|ication)/i,
    ],
  },
  Academic: {
    keywords: [
      "student",
      "university",
      "college",
      "school",
      "degree",
      "grade",
      "course",
      "exam",
      "transcript",
    ],
    patterns: [
      /university|college|school/i,
      /grade|marksheet|mark\s*sheet|transcript/i,
      /course\s*completion\s*certificate/i,
      /semester|credits/i,
      /degree/i,
    ],
  },
  Personal: {
    keywords: [
      "passport",
      "driver",
      "driving",
      "license",
      "birth certificate",
      "marriage certificate",
      "personal id",
      "aadhaar",
      "aadhar",
      "pan card",
    ],
    patterns: [
      /passport/i,
      /driver.*license|driving\s*licen[sc]e/i,
      /birth\s*certificate/i,
      /marriage\s*certificate/i,
      /aadha[ar]\s*(number|no\.?)/i,
      /pan\s*(number|no\.?|card)/i,
      /personal\s*id/i,
    ],
  },
  "Personal Documents": {
    keywords: [
      "passport",
      "driver",
      "driving",
      "license",
      "birth certificate",
      "marriage certificate",
      "personal id",
      "aadhaar",
      "aadhar",
      "pan card",
      "voter",
      "national id",
    ],
    patterns: [
      /passport/i,
      /driver.*license|driving\s*licen[sc]e/i,
      /birth\s*certificate/i,
      /marriage\s*certificate/i,
      /aadha[ar]\s*(number|no\.?)/i,
      /pan\s*(number|no\.?|card)/i,
      /voter\s*(id|card)/i,
      /national\s*id/i,
      /personal\s*id/i,
    ],
  },
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeText(value: string): string {
  return value
    .replace(/\0/g, "")
    .replace(/[_\-]+/g, " ")
    .toLowerCase();
}

function quickDetectCategory(text: string): DocumentCategory | null {
  // High-signal overrides to prevent generic “certificate” matches.
  if (
    /medical\s*certificate/i.test(text) ||
    /fit\s*to\s*work/i.test(text) ||
    /unfit\s*to\s*work/i.test(text)
  ) {
    return "Medical Reports";
  }

  if (
    /tax\s*invoice/i.test(text) ||
    /invoice\s*(number|no\.?|#)/i.test(text) ||
    /\binvoice\b/i.test(text) ||
    /gstin/i.test(text)
  ) {
    return "Invoices";
  }

  if (/(\breceipt\b|cash\s*memo|thank\s+you\s+for\s+shopping)/i.test(text)) {
    return "Receipts";
  }

  return null;
}

export function classifyByRules(text: string): ClassificationResult | null {
  const truncatedText = normalizeText(text.slice(0, 4000));

  const quick = quickDetectCategory(truncatedText);
  if (quick) {
    return {
      category: quick,
      confidence: 0.92,
      mode: "rule-based",
      reasoning: `Quick-detected ${quick} from high-signal patterns`,
    };
  }

  let bestMatch: {
    category: DocumentCategory;
    score: number;
  } | null = null;

  // Score each category
  for (const [category, rules] of Object.entries(RULE_PATTERNS)) {
    if (!rules) continue;

    let score = 0;

    // Check keywords
    for (const keyword of rules.keywords) {
      const count = (
        truncatedText.match(
          new RegExp(escapeRegExp(keyword.toLowerCase()), "g"),
        ) || []
      ).length;
      score += count * 1;
    }

    // Check patterns (higher weight)
    for (const pattern of rules.patterns) {
      const matches = (truncatedText.match(pattern) || []).length;
      score += matches * 3;
    }

    // Update best match
    if (score > (bestMatch?.score ?? 0)) {
      bestMatch = {
        category: category as DocumentCategory,
        score,
      };
    }
  }

  // Only return rule-based classification if confidence is high enough
  if (bestMatch && bestMatch.score >= 4) {
    return {
      category: bestMatch.category,
      confidence: Math.min(bestMatch.score / 10, 0.95), // Cap at 0.95 for rule-based
      mode: "rule-based",
      reasoning: `Matched ${bestMatch.category} rules with score ${bestMatch.score.toFixed(1)}`,
    };
  }

  return null;
}
