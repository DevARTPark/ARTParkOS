import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface QuestionSlideProps {
  isActive: boolean;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  canProceed?: boolean; // Optional, defaults to true if onNext is present
}

export default function QuestionSlide({
  isActive,
  title,
  subtitle,
  children,
  onNext,
  onBack,
  canProceed = true,
}: QuestionSlideProps) {
  // Handle 'Enter' key for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isActive && canProceed && e.key === "Enter" && onNext) {
        const target = e.target as HTMLElement;
        // Prevent submitting when typing in textareas
        if (target.tagName !== "TEXTAREA") {
          onNext();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, canProceed, onNext]);

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-6 w-full max-w-2xl mx-auto"
    >
      {/* Header Section */}
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg text-gray-500 font-medium leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Main Content Area */}
      <div className="py-2">{children}</div>

      {/* Navigation Footer */}
      <div className="flex items-center gap-4 pt-4">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all hover:-translate-x-1"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>
        )}

        {onNext && (
          <button
            onClick={onNext}
            disabled={!canProceed}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200
              ${
                canProceed
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:scale-105"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            Next
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        {onNext && canProceed && (
          <span className="text-xs text-gray-400 hidden md:inline-block ml-2 animate-pulse">
            press <strong>Enter ↵</strong>
          </span>
        )}
      </div>
    </motion.div>
  );
}
