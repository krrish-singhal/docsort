"use client";

import { useState, useRef } from "react";
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AuthDialog } from "@/components/AuthDialog";

type UploadedFile = {
  id: string;
  fileName: string;
  fileUrl: string;
  category: string;
  uploadedAt: string;
  confidence?: number;
  mode?: string;
};

type UploadApiResponse =
  | { success: true; file: UploadedFile }
  | { success: false; error: string };

type CloudinarySignatureResponse =
  | {
      success: true;
      cloudName: string;
      apiKey: string;
      timestamp: number;
      folder: string;
      signature: string;
      resourceType: string;
      useFilename: boolean;
      uniqueFilename: boolean;
    }
  | { success: false; error: string };

interface UploadZoneProps {
  onUploadComplete?: (result: unknown) => void;
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

  const normalizeUploadError = (message: string): string => {
    // Hide vendor-specific copy and show a clean limit message.
    if (
      /file size too large|maximum is|upgrade your plan|file[- ]?limit/i.test(
        message,
      )
    ) {
      return "File size is too large. Max 10MB allowed.";
    }
    return message;
  };

  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingNavigateToFolders, setPendingNavigateToFolders] =
    useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const parseUploadApiResponse = async (
    response: Response,
  ): Promise<UploadApiResponse> => {
    const raw = await response.text();
    let parsed: unknown = null;
    if (raw) {
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = null;
      }
    }

    const data: UploadApiResponse | null =
      parsed &&
      typeof parsed === "object" &&
      parsed !== null &&
      "success" in parsed
        ? (parsed as UploadApiResponse)
        : null;

    if (data) return data;
    // Non-JSON response
    return {
      success: false,
      error: raw?.trim() || response.statusText || "Upload failed",
    };
  };

  const isEntityTooLarge = (message: string): boolean => {
    return /request entity too large|payload too large|too large/i.test(
      message,
    );
  };

  const uploadMultipart = async (file: File): Promise<UploadedFile> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/files/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await parseUploadApiResponse(response);
    if (!response.ok || !data.success) {
      const errorMessage = !data.success ? data.error : "Upload failed";
      throw new Error(errorMessage || "Upload failed");
    }
    return data.file;
  };

  const uploadViaCloudinary = async (file: File): Promise<UploadedFile> => {
    const sigRes = await fetch("/api/files/upload/signature", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    const sigRaw = await sigRes.text();
    let sigParsed: CloudinarySignatureResponse | null = null;
    try {
      sigParsed = JSON.parse(sigRaw) as CloudinarySignatureResponse;
    } catch {
      sigParsed = null;
    }

    if (!sigRes.ok || !sigParsed || !sigParsed.success) {
      throw new Error(
        (sigParsed && !sigParsed.success
          ? sigParsed.error
          : "Unable to start upload") || "Unable to start upload",
      );
    }

    const cloudForm = new FormData();
    cloudForm.append("file", file);
    cloudForm.append("api_key", sigParsed.apiKey);
    cloudForm.append("timestamp", String(sigParsed.timestamp));
    cloudForm.append("signature", sigParsed.signature);
    cloudForm.append("folder", sigParsed.folder);
    cloudForm.append("use_filename", sigParsed.useFilename ? "true" : "false");
    cloudForm.append(
      "unique_filename",
      sigParsed.uniqueFilename ? "true" : "false",
    );

    const cloudUrl = `https://api.cloudinary.com/v1_1/${encodeURIComponent(
      sigParsed.cloudName,
    )}/${encodeURIComponent(sigParsed.resourceType)}/upload`;

    const cloudRes = await fetch(cloudUrl, {
      method: "POST",
      body: cloudForm,
    });

    const cloudJson = (await cloudRes.json().catch(() => null)) as {
      secure_url?: string;
      public_id?: string;
      error?: { message?: string };
    } | null;

    if (!cloudRes.ok || !cloudJson?.secure_url || !cloudJson.public_id) {
      const message = normalizeUploadError(
        cloudJson?.error?.message || "Cloud upload failed",
      );
      throw new Error(message);
    }

    const finalizeRes = await fetch("/api/files/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        fileUrl: cloudJson.secure_url,
        cloudinaryPublicId: cloudJson.public_id,
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
      }),
    });

    const data = await parseUploadApiResponse(finalizeRes);
    if (!finalizeRes.ok || !data.success) {
      const message = !data.success ? data.error : "Upload failed";
      throw new Error(message || "Upload failed");
    }

    return data.file;
  };

  const uploadFile = async (file: File) => {
    setError(null);
    setUploadResult(null);

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("File size is too large. Max 10MB allowed.");
      return;
    }

    setIsLoading(true);

    try {
      // Prefer multipart for small files; fall back to direct-to-Cloudinary when
      // production request-body limits (often 413) block uploads.
      let result: UploadedFile;
      if (file.size > 4_000_000) {
        result = await uploadViaCloudinary(file);
      } else {
        try {
          result = await uploadMultipart(file);
        } catch (e) {
          const msg = e instanceof Error ? e.message : "";
          if (isEntityTooLarge(msg)) {
            result = await uploadViaCloudinary(file);
          } else {
            throw e;
          }
        }
      }
      setUploadResult(result);
      onUploadComplete?.(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";

      toast.error(normalizeUploadError(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleSeeFolders = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (res.ok) {
        router.push("/folders");
        return;
      }

      if (res.status === 401) {
        setPendingNavigateToFolders(true);
        setAuthOpen(true);
        return;
      }

      setError("Unable to verify your session. Please try again.");
    } catch {
      setError("Unable to verify your session. Please try again.");
    }
  };

  return (
    <div className="w-full space-y-6">
      <div
        className={`relative rounded-lg border-2 border-dashed transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:border-gray-400"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="p-12 text-center">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInput}
            className="hidden"
            accept=".pdf,.docx,.doc,.txt"
          />

          {isLoading ? (
            <>
              <Loader2 className="mx-auto h-12 w-12 text-blue-600 animate-spin" />
              <p className="mt-4 text-sm font-medium text-gray-700">
                Processing your file...
              </p>
            </>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-lg font-semibold text-gray-900">
                Drag & drop your document
              </p>
              <p className="mt-1 text-sm text-gray-600">or</p>
              <Button onClick={handleClick} variant="outline" className="mt-4">
                Choose a file
              </Button>
              <p className="mt-4 text-xs text-gray-500">
                Supported formats: PDF, DOCX, DOC, TXT
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Upload failed</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {uploadResult && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex gap-3 mb-4">
            <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900">Upload successful!</p>
              <p className="text-sm text-green-700">
                Your file has been organized.
              </p>
            </div>
          </div>

          <div className="space-y-3 bg-white rounded-lg p-4 border border-green-100">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">
                File name
              </p>
              <p className="text-sm font-medium text-gray-900 break-all">
                {uploadResult.fileName}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">
                Category
              </p>
              <p className="text-sm font-medium text-gray-900">
                {uploadResult.category}
              </p>
            </div>

            <div className="pt-2">
              <Button
                type="button"
                className="w-full"
                onClick={handleSeeFolders}
              >
                See the folders
              </Button>
            </div>
          </div>
        </div>
      )}

      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        onAuthed={async () => {
          const navigate = pendingNavigateToFolders;
          setPendingNavigateToFolders(false);
          if (navigate) router.push("/folders");
        }}
      />
    </div>
  );
}
