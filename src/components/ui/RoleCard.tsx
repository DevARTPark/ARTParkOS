import React from "react";
import { ArrowRight } from "lucide-react";

interface RoleCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  accentClass?: string; // tailwind bg color for icon container
  openInNewTab?: boolean;
}

export default function RoleCard({
  title,
  description,
  href,
  icon: Icon,
  accentClass = "bg-blue-500",
  openInNewTab = false,
}: RoleCardProps) {
  return (
    <a
      href={href}
      className="group block"
      {...(openInNewTab
        ? { target: "_blank", rel: "noreferrer noopener" }
        : {})}
    >
      <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-2xl h-full flex flex-col items-center text-center">
        <div
          className={`w-16 h-16 ${accentClass} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>

        <p className="text-slate-300 mb-8 flex-1">{description}</p>

        <div className="flex items-center text-blue-400 font-semibold group-hover:text-blue-300">
          Enter Dashboard <ArrowRight className="ml-2 w-4 h-4" />
        </div>
      </div>
    </a>
  );
}
