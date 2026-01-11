// import React from "react";
import { ShieldCheck } from "lucide-react";
import type { Declarations } from "../../store/useApplicationStore";

interface ConsentItem {
  id: keyof Declarations;
  label: string;
}

interface ConsentSlideProps {
  items: ConsentItem[];
  values: Declarations;
  onUpdate: (field: keyof Declarations, value: boolean) => void;
}

export default function ConsentSlide({
  items,
  values,
  onUpdate,
}: ConsentSlideProps) {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-purple-50 text-purple-900 rounded-xl border border-purple-100 flex gap-3">
        <ShieldCheck className="w-6 h-6 shrink-0" />
        <p className="text-sm">
          These declarations are legally binding. Please read carefully before
          confirming.
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const isChecked = values[item.id];
          return (
            <label
              key={item.id}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer
                ${
                  isChecked
                    ? "border-blue-600 bg-blue-50/50"
                    : "border-gray-200 hover:border-blue-300 bg-white"
                }`}
            >
              <div className="relative flex items-center mt-1">
                <input
                  type="checkbox"
                  className="w-5 h-5 border-2 border-gray-300 rounded focus:ring-blue-500 text-blue-600"
                  checked={isChecked}
                  onChange={(e) => onUpdate(item.id, e.target.checked)}
                />
              </div>
              <span
                className={`text-base ${
                  isChecked ? "text-gray-900 font-medium" : "text-gray-600"
                }`}
              >
                {item.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
