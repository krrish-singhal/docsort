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
