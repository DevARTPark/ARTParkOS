import React, { useState } from "react";
import { UploadCloud, X, CheckCircle2, Loader2, FileText } from "lucide-react";
import { API_URL } from "../../../config"; // Ensure config exists

interface FileConfig {
  key: string;
  label: string;
  accept?: string;
  required?: boolean;
}

interface UploadSlideProps {
  files: FileConfig[];
  values: any; // e.g. { uploads: { pitchDeck: 'https://...' } }
  onUpdate: (key: string, fileUrl: string | null) => void;
}

export default function UploadSlide({
  files,
  values,
  onUpdate,
}: UploadSlideProps) {
  // Track which specific file is currently uploading
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const handleFile = async (
    key: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Size Validation (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Maximum size is 10MB.");
      return;
    }

    setUploadingKey(key);

    // 2. Read File
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Data = reader.result;

      try {
        // 3. Upload to Server
        const res = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            fileData: base64Data,
          }),
        });

        const data = await res.json();

        if (res.ok && data.url) {
          // 4. Save URL to Store
          onUpdate(key, data.url);
        } else {
          alert("Upload failed: " + (data.error || "Unknown error"));
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Network error during upload.");
      } finally {
        setUploadingKey(null);
      }
    };
  };

  // Helper to get a clean filename for display from the URL
  const getDisplayParams = (url: string | null) => {
    if (!url) return null;
    try {
      // Remove timestamp prefix (e.g., "123456_file.pdf" -> "file.pdf")
      return url.split("/").pop()?.replace(/^\d+_/, "") || "Uploaded File";
    } catch {
      return "Uploaded File";
    }
  };

  return (
    <div className="space-y-4">
      {files.map((f) => {
        const fileUrl = values.uploads?.[f.key];
        const isUploading = uploadingKey === f.key;
        const fileName = getDisplayParams(fileUrl);

        return (
          <div
            key={f.key}
            className={`relative p-4 border-2 rounded-xl transition-all group
            ${
              fileUrl
                ? "border-green-200 bg-green-50"
                : isUploading
                  ? "border-blue-200 bg-blue-50"
                  : "border-dashed border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-white"
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Icon State */}
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors
                ${
                  fileUrl
                    ? "bg-green-200 text-green-700"
                    : isUploading
                      ? "bg-blue-100 text-blue-600"
                      : "bg-white border border-gray-200 text-gray-400"
                }`}
              >
                {isUploading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : fileUrl ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <UploadCloud className="w-6 h-6" />
                )}
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 flex items-center gap-1">
                  {f.label}
                  {f.required && <span className="text-red-500">*</span>}
                </h4>
                {isUploading ? (
                  <p className="text-xs text-blue-600 font-medium animate-pulse">
                    Uploading...
                  </p>
                ) : fileUrl ? (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:underline truncate block"
                  >
                    {fileName}
                  </a>
                ) : (
                  <p className="text-xs text-gray-500">
                    Max 10MB • Drag & drop or click
                  </p>
                )}
              </div>

              {/* Actions */}
              {fileUrl ? (
                <button
                  onClick={() => onUpdate(f.key, null)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                  title="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
              ) : (
                <label
                  className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm border transition-all
                  ${
                    isUploading
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                      : "cursor-pointer bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {isUploading ? "Wait..." : "Select"}
                  <input
                    type="file"
                    className="hidden"
                    accept={f.accept}
                    disabled={!!isUploading} // convert string|null to boolean
                    onChange={(e) => handleFile(f.key, e)}
                  />
                </label>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
