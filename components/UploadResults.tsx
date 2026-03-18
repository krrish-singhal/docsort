"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface UploadResult {
  filename: string;
  category: string;
  confidence: number;
  mode: "rules" | "ai";
  status: "success" | "error";
  error?: string;
  timestamp: string;
}

interface UploadResultsProps {
  results: UploadResult[];
}

const CATEGORY_ICONS: Record<string, string> = {
  Invoices: "📄",
  Finance: "💰",
  "Medical Reports": "🏥",
  Legal: "⚖️",
  Academic: "🎓",
  Receipts: "🧾",
  "Personal Documents": "👤",
  Others: "📦",
};

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Invoices: "bg-blue-100 text-blue-800",
    Finance: "bg-green-100 text-green-800",
    "Medical Reports": "bg-red-100 text-red-800",
    Legal: "bg-purple-100 text-purple-800",
    Academic: "bg-yellow-100 text-yellow-800",
    Receipts: "bg-orange-100 text-orange-800",
    "Personal Documents": "bg-pink-100 text-pink-800",
    Others: "bg-gray-100 text-gray-800",
  };
  return colors[category] || "bg-gray-100 text-gray-800";
};

export function UploadResults({ results }: UploadResultsProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-2xl font-bold text-foreground">Upload Results</h2>
      <div className="grid gap-4">
        {results.map((result, index) => (
          <Card
            key={index}
            className={result.status === "error" ? "border-red-200" : ""}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {result.status === "success" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <CardTitle className="text-lg">{result.filename}</CardTitle>
                  </div>
                  <CardDescription className="mt-1">
                    {new Date(result.timestamp).toLocaleString()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {result.status === "success" ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {CATEGORY_ICONS[result.category] || "📁"}
                    </span>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Classified as
                      </p>
                      <p className="font-semibold text-foreground">
                        {result.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Confidence
                      </p>
                      <p className="font-medium">
                        {(result.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Classification Method
                      </p>
                      <Badge
                        variant={
                          result.mode === "rules" ? "secondary" : "default"
                        }
                      >
                        {result.mode === "rules" ? "Rule-Based" : "AI (Groq)"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-red-600 font-medium">
                    Upload Failed
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {result.error}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
