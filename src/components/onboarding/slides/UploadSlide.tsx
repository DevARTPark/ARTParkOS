import React from "react";
import { UploadCloud, X, CheckCircle2 } from "lucide-react";

interface FileConfig {
  key: string;
  label: string;
  accept?: string;
}

interface UploadSlideProps {
  files: FileConfig[];
  values: any; // expects { uploads: { pitchDeck: '...' } }
  onUpdate: (key: string, fileName: string | null) => void;
}

export default function UploadSlide({
  files,
  values,
  onUpdate,
}: UploadSlideProps) {
  const handleFile = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      // In real app, upload to server here
      onUpdate(key, e.target.files[0].name);
    }
  };

  return (
    <div className="space-y-4">
      {files.map((f) => {
        const fileName = values.uploads?.[f.key];

        return (
          <div
            key={f.key}
            className={`relative p-4 border-2 rounded-xl transition-all group
            ${
              fileName
                ? "border-green-200 bg-green-50"
                : "border-dashed border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-white"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center 
                ${
                  fileName
                    ? "bg-green-200 text-green-700"
                    : "bg-white border border-gray-200 text-gray-400"
                }`}
              >
                {fileName ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <UploadCloud className="w-6 h-6" />
                )}
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{f.label}</h4>
                <p className="text-xs text-gray-500 truncate max-w-50">
                  {fileName || "Max 10MB • Drag & drop or click"}
                </p>
              </div>

              {fileName ? (
                <button
                  onClick={() => onUpdate(f.key, null)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              ) : (
                <label className="cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                  Select
                  <input
                    type="file"
                    className="hidden"
                    accept={f.accept}
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
