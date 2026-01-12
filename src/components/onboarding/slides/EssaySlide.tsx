// import React from "react";

interface QuestionConfig {
  label: string;
  field: string;
  placeholder?: string;
  minChars?: number;
}

interface EssaySlideProps {
  questions: QuestionConfig[];
  values: any;
  onUpdate: (path: string, value: string) => void;
}

export default function EssaySlide({
  questions,
  values,
  onUpdate,
}: EssaySlideProps) {
  const getValue = (path: string) => {
    return (
      path
        .split(".")
        .reduce(
          (obj, key) => (obj && obj[key] !== undefined ? obj[key] : ""),
          values
        ) || ""
    );
  };

  return (
    <div className="space-y-6">
      {questions.map((q) => {
        const val = getValue(q.field);
        const count = val.length;
        const min = q.minChars || 0;
        const isValid = count >= min;

        return (
          <div key={q.field} className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-gray-900 font-semibold text-lg">
                {q.label}
              </label>
              {min > 0 && (
                <span
                  className={`text-xs font-mono font-medium ${
                    isValid ? "text-green-600" : "text-orange-500"
                  }`}
                >
                  {count} / {min}
                </span>
              )}
            </div>

            <textarea
              className={`w-full p-4 text-lg border-2 rounded-xl focus:ring-0 resize-none transition-all h-40
                ${
                  isValid
                    ? "border-gray-200 focus:border-blue-500"
                    : "border-orange-200 focus:border-orange-500 bg-orange-50/10"
                }`}
              placeholder={q.placeholder}
              value={val}
              onChange={(e) => onUpdate(q.field, e.target.value)}
            />
          </div>
        );
      })}
    </div>
  );
}
