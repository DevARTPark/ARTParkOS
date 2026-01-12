// import React from "react";
import { Check } from "lucide-react";

interface Option {
  id: string;
  label: string;
  icon?: any; // React Component or Lucide Icon
  description?: string;
}

interface OptionSlideProps {
  options: Option[];
  selected: string | string[];
  multiSelect?: boolean;
  onSelect: (value: string) => void;
}

export default function OptionSlide({
  options,
  selected,
  onSelect,
}: OptionSlideProps) {
  const isSelected = (id: string) => {
    if (Array.isArray(selected)) return selected.includes(id);
    return selected === id;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option) => {
        const Icon = option.icon;
        const active = isSelected(option.id);

        return (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`relative p-5 text-left rounded-xl border-2 transition-all duration-200 group flex flex-col gap-3
              ${
                active
                  ? "border-blue-600 bg-blue-50 shadow-md transform scale-[1.02]"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
              }`}
          >
            <div className="flex justify-between w-full">
              {/* Icon Box */}
              {Icon && (
                <div
                  className={`p-3 rounded-lg transition-colors ${
                    active
                      ? "bg-blue-200 text-blue-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              )}
              {/* Checkmark */}
              {active && (
                <div className="text-blue-600">
                  <Check className="w-6 h-6" />
                </div>
              )}
            </div>

            <div>
              <h3
                className={`font-bold text-lg ${
                  active ? "text-blue-900" : "text-gray-900"
                }`}
              >
                {option.label}
              </h3>
              {option.description && (
                <p className="text-sm text-gray-500 mt-1 leading-snug">
                  {option.description}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
