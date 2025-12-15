import React, { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

export interface Filter {
  key: string;
  label: string;
  value: string;
}

export interface FilterBarProps {
  filters: Filter[];
  onRemoveFilter: (key: string) => void;
  onClearAll: () => void;
  children?: ReactNode;
}

export default function FilterBar({
  filters,
  onRemoveFilter,
  onClearAll,
  children,
}: FilterBarProps) {
  if (filters.length === 0 && !children) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
      {filters.map((filter) => (
        <div
          key={filter.key}
          className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-full text-sm shadow-sm"
        >
          <span className="text-gray-500">{filter.label}:</span>
          <span className="font-medium text-gray-900">{filter.value}</span>
          <button
            onClick={() => onRemoveFilter(filter.key)}
            className="ml-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      {children}
      {filters.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="ml-auto text-gray-500 hover:text-gray-900"
        >
          Clear all
        </Button>
      )}
    </div>
  );
}
