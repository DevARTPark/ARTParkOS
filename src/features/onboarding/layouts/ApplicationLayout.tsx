import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { SECTIONS } from "../config/sections";
import artparkLogo from "../../../assets/artpark_in_logo.jpg";

interface ApplicationLayoutProps {
  children: React.ReactNode;
  currentSectionId: string; // e.g. 'venture'
  localProgress: number; // 0 to 100 (Progress within current section)
  trackTitle?: string;
}

export default function ApplicationLayout({
  children,
  currentSectionId,
  localProgress,
  trackTitle = "Founder Track",
}: ApplicationLayoutProps) {
  // Helper to determine section status
  const getSectionStatus = (sectionId: string) => {
    const currentIndex = SECTIONS.findIndex((s) => s.id === currentSectionId);
    const sectionIndex = SECTIONS.findIndex((s) => s.id === sectionId);

    if (sectionIndex < currentIndex) return "completed";
    if (sectionIndex === currentIndex) return "active";
    return "pending";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans overflow-hidden">
      {/* --- SIDEBAR (Global Progress) --- */}
      {/* Hidden on mobile, visible on medium screens+ */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-gray-200 h-screen sticky top-0 z-20">
        {/* Logo Area */}
        <div className="p-8 pb-4">
          <img src={artparkLogo} alt="ARTPARK" className="h-10 w-auto mb-2" />
          <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
            {trackTitle}
          </span>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-4">
          {SECTIONS.map((section) => {
            const status = getSectionStatus(section.id);
            const Icon = section.icon;

            return (
              <div
                key={section.id}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300
                  ${
                    status === "active"
                      ? "bg-blue-50 border border-blue-100"
                      : "opacity-60"
                  }
                `}
              >
                {/* Icon Box */}
                <div
                  className={`
                  w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                  ${status === "completed" ? "bg-green-100 text-green-600" : ""}
                  ${
                    status === "active"
                      ? "bg-blue-600 text-white shadow-md"
                      : ""
                  }
                  ${status === "pending" ? "bg-gray-100 text-gray-400" : ""}
                `}
                >
                  {status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                {/* Text */}
                <div className="flex-1">
                  <p
                    className={`text-sm font-semibold ${
                      status === "active" ? "text-blue-900" : "text-gray-700"
                    }`}
                  >
                    {section.label}
                  </p>
                  {status === "active" && (
                    <p className="text-xs text-blue-600 font-medium animate-pulse">
                      In Progress
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="p-6 border-t border-gray-100 text-xs text-gray-400">
          <p>
            Application ID:{" "}
            <span className="font-mono text-gray-600">
              #DRAFT-{new Date().getFullYear()}
            </span>
          </p>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-screen relative">
        {/* Top Header (Mobile Logo + Local Progress) */}
        <header className="h-16 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 border-b border-gray-100 z-10 sticky top-0">
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="md:hidden flex items-center gap-3">
            <img src={artparkLogo} alt="Logo" className="h-8 rounded" />
            <span className="text-xs font-bold text-gray-400">
              {trackTitle}
            </span>
          </div>

          {/* Spacer for Desktop (keeps title centered/aligned) */}
          <div className="hidden md:block"></div>

          {/* Context Help */}
          <div className="text-xs text-gray-400">
            Press{" "}
            <span className="font-bold border border-gray-300 rounded px-1 bg-white text-gray-600">
              Enter ↵
            </span>{" "}
            to continue
          </div>

          {/* --- LOCAL PROGRESS BAR --- */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
            <motion.div
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${localProgress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </header>

        {/* The Slide Stage */}
        <main className="flex-1 overflow-y-auto relative flex flex-col items-center justify-center p-6 bg-gray-50">
          <div className="w-full max-w-2xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
