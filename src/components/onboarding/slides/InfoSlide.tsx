// import React from "react";
import { Rocket, ShieldCheck, CheckCircle2 } from "lucide-react";

interface InfoSlideProps {
  type?: "intro" | "success" | "info";
  content?: string;
}

export default function InfoSlide({ type = "intro", content }: InfoSlideProps) {
  const icons = {
    intro: <Rocket className="w-16 h-16 text-blue-500" />,
    success: <CheckCircle2 className="w-16 h-16 text-green-500" />,
    info: <ShieldCheck className="w-16 h-16 text-purple-500" />,
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-10 animate-in zoom-in-95 duration-500">
      <div className="mb-8 p-6 bg-white rounded-full shadow-lg border border-gray-100 ring-4 ring-gray-50">
        {icons[type] || icons.intro}
      </div>
      {content && (
        <div className="max-w-lg mx-auto text-gray-600 text-lg leading-relaxed">
          {content}
        </div>
      )}
    </div>
  );
}
