export const CATEGORIES = [
  "Invoices",
  "Finance",
  "Medical Reports",
  "Legal",
  "Academic",
  "Receipts",
  "Personal Documents",
  "Others",
] as const;

export type Category = (typeof CATEGORIES)[number];

export function isCategory(value: unknown): value is Category {
  return (
    typeof value === "string" &&
    (CATEGORIES as readonly string[]).includes(value)
  );
}

export function normalizeCategory(raw: unknown): Category {
  if (typeof raw !== "string") return "Others";
  const s = raw.trim();

  if (isCategory(s)) return s;

  const lower = s.toLowerCase();
  if (lower === "personal" || lower === "personal document")
    return "Personal Documents";
  if (
    lower === "agreements" ||
    lower === "agreement" ||
    lower === "contract" ||
    lower === "contracts"
  )
    return "Legal";
  if (lower === "documents" || lower === "document" || lower === "general")
    return "Others";
  if (lower === "receipt") return "Receipts";
  if (lower === "invoice") return "Invoices";
  if (lower.includes("medical")) return "Medical Reports";
  if (lower.includes("finance") || lower === "bank statement") return "Finance";
  if (lower.includes("academic") || lower === "education") return "Academic";
  if (lower.includes("legal")) return "Legal";

  return "Others";
}
