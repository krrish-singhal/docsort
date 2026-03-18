export type DocumentCategory =
  | "Documents"
  | "Invoices"
  | "Finance"
  | "Medical Reports"
  | "Legal"
  | "Academic"
  | "Receipts"
  | "Personal"
  | "Personal Documents"
  | "Others";

export interface ClassificationResult {
  category: DocumentCategory;
  confidence: number;
  mode: "rule-based" | "ai";
  reasoning?: string;
}

export interface ExtractionResult {
  text: string;
  language?: string;
  extractedFrom: "text" | "ocr";
}

export interface FileOrganizationResult {
  filename: string;
  originalPath: string;
  organizedPath: string;
  category: DocumentCategory;
  classification: ClassificationResult;
}

export interface UploadResponse {
  success: boolean;
  file?: FileOrganizationResult;
  error?: string;
}
