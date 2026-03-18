"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AuthDialog } from "@/components/AuthDialog";
import { CATEGORIES, type Category } from "@/src/lib/categories";

export const dynamic = "force-dynamic";

type FileItem = {
  id: string;
  fileName: string;
  fileUrl: string;
  category: Category;
  uploadedAt: string;
};

type FolderCategory = {
  category: Category;
  files: FileItem[];
  count: number;
};

function isPdf(filename: string): boolean {
  return filename.toLowerCase().endsWith(".pdf");
}

async function fetchUserFolders(): Promise<{
  grouped: { category: Category; files: FileItem[] }[];
}> {
  const res = await fetch("/api/files", {
    method: "GET",
    cache: "no-store",
    credentials: "include",
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Failed to fetch files");
  }
  return {
    grouped: (json.grouped ?? []) as {
      category: Category;
      files: FileItem[];
    }[],
  };
}

export default function FoldersPage() {
  const [loading, setLoading] = React.useState(true);
  const [unauthorized, setUnauthorized] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [categories, setCategories] = React.useState<FolderCategory[]>([]);

  const [authOpen, setAuthOpen] = React.useState(false);

  const [selectedCategory, setSelectedCategory] = React.useState<Category>(
    CATEGORIES[0] ?? "Others",
  );
  const [selectedFileId, setSelectedFileId] = React.useState<string | null>(
    null,
  );

  const selectedFiles =
    categories.find((c) => c.category === selectedCategory)?.files ?? [];
  const activeFile =
    typeof selectedFileId === "string"
      ? (selectedFiles.find((f) => f.id === selectedFileId) ??
        selectedFiles[0] ??
        null)
      : (selectedFiles[0] ?? null);

  const fileUrl = activeFile
    ? `/api/files/${encodeURIComponent(activeFile.id)}/content`
    : null;

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserFolders();
      const ordered: FolderCategory[] = CATEGORIES.map((cat) => {
        const existing = data.grouped.find((c) => c.category === cat);
        const files = existing?.files ?? [];
        return { category: cat, files, count: files.length };
      });
      setCategories(ordered);
      setUnauthorized(false);
      const firstNonEmpty =
        ordered.find((g) => g.files.length > 0)?.category ??
        CATEGORIES[0] ??
        "Others";
      setSelectedCategory((prev) =>
        ordered.find((g) => g.category === prev) ? prev : firstNonEmpty,
      );
      setSelectedFileId(null);
    } catch (e) {
      if (e instanceof Error && e.message === "UNAUTHORIZED") {
        setUnauthorized(true);
        setAuthOpen(true);
      } else {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">
              Organized Folders
            </h1>
            <p className="text-sm text-gray-600">
              {unauthorized
                ? "Sign in to view your folders"
                : "Browse your uploaded files"}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/">Back to upload</Link>
          </Button>
        </div>

        {unauthorized ? (
          <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
            Please sign in to view your folders.
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <Card className="lg:col-span-3">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {categories.map(({ category, files }) => {
                      const active = category === selectedCategory;
                      return (
                        <Button
                          key={category}
                          variant={active ? "default" : "outline"}
                          className="justify-between"
                          onClick={() => {
                            setSelectedCategory(category);
                            setSelectedFileId(null);
                          }}
                          disabled={loading}
                        >
                          <span>{category}</span>
                          <span
                            className={
                              active ? "text-white/80" : "text-muted-foreground"
                            }
                          >
                            {files.length}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    Files in {selectedCategory}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedFiles.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No files found in this category yet.
                    </div>
                  ) : (
                    <ScrollArea className="h-105 pr-3">
                      <div className="grid gap-2">
                        {selectedFiles.map((file) => {
                          const active = file.id === activeFile?.id;
                          return (
                            <Button
                              key={file.id}
                              variant={active ? "secondary" : "outline"}
                              className="justify-start"
                              onClick={() => setSelectedFileId(file.id)}
                            >
                              <span className="truncate" title={file.fileName}>
                                {file.fileName}
                              </span>
                            </Button>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  )}

                  {fileUrl && (
                    <div className="mt-4">
                      <Button asChild className="w-full" variant="outline">
                        <a href={fileUrl} target="_blank" rel="noreferrer">
                          Download / Open
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="lg:col-span-5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  {!fileUrl || !activeFile ? (
                    <div className="text-sm text-muted-foreground">
                      Select a file to preview.
                    </div>
                  ) : isPdf(activeFile.fileName) ? (
                    <iframe
                      key={fileUrl}
                      src={fileUrl}
                      className="h-130 w-full rounded-md border"
                      title={activeFile.fileName}
                    />
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Preview is available for PDFs. Use “Download / Open” to
                        view this file.
                      </p>
                      <div className="rounded-md border bg-white p-3 text-sm">
                        <div className="font-medium text-gray-900">
                          {activeFile.fileName}
                        </div>
                        <div className="text-muted-foreground">
                          {selectedCategory}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        <AuthDialog
          open={authOpen}
          onOpenChange={setAuthOpen}
          onAuthed={async () => {
            setUnauthorized(false);
            await load();
          }}
        />
      </div>
    </main>
  );
}
