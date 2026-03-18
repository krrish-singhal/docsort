import type { Metadata } from "next";
import { UploadZone } from "@/components/UploadZone";

export const metadata: Metadata = {
  title: "Document Organizer - AI-Powered File Classification",
  description:
    "Automatically organize your documents using intelligent AI classification",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="mx-auto max-w-2xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 text-balance">
              Intelligent Document Organization
            </h1>
            <p className="text-lg text-gray-600 text-pretty">
              Upload your documents and let AI automatically classify and
              organize them into the right folders.
            </p>
          </div>

          {/* Upload Zone */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <UploadZone />
          </div>

          {/* Feature List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-gray-100 bg-white p-4 space-y-2">
              <p className="text-sm font-semibold text-gray-900">
                Intelligent Classification
              </p>
              <p className="text-xs text-gray-600">
                Uses hybrid AI technology to classify documents with high
                accuracy
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-white p-4 space-y-2">
              <p className="text-sm font-semibold text-gray-900">
                Instant Organization
              </p>
              <p className="text-xs text-gray-600">
                Documents are automatically sorted into categorized folders
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-white p-4 space-y-2">
              <p className="text-sm font-semibold text-gray-900">
                Privacy First
              </p>
              <p className="text-xs text-gray-600">
                Your documents are processed securely with full privacy
                protection
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
