import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header, HeaderUser } from "./Header";
import { Role } from "../../types";
import { motion } from "framer-motion";

// Mock user data import
import { currentUser as mockFounder } from "../../data/mockData";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: Role;
  title?: string;
}

export function DashboardLayout({
  children,
  role,
  title,
}: DashboardLayoutProps) {
  // State to manage desktop sidebar collapse
  const [isCollapsed, setIsCollapsed] = useState(false);
  // State to manage mobile sidebar visibility
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Explicitly type the state as HeaderUser
  const [user, setUser] = useState<HeaderUser>({
    name: "Loading...",
    role: role,
    avatar: "",
  });

  React.useEffect(() => {
    if (role === "supplier") {
      const savedProfile = localStorage.getItem("artpark_supplier_profile");
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setUser({
          name: parsed.name || "Supplier Account",
          role: "Supplier Partner",
          avatar: parsed.logoDataUrl,
        });
      } else {
        setUser({
          name: "New Supplier",
          role: "Supplier Partner",
          avatar: "",
        });
      }
    } else if (role === "founder") {
      setUser({
        name: mockFounder.name,
        role: mockFounder.role,
        avatar: mockFounder.avatar,
      });
    } else {
      setUser({
        name: role === "admin" ? "System Admin" : "Reviewer Account",
        role: role,
        avatar: "",
      });
    }
  }, [role]);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-slate-900">
      {/* Sidebar handles its own responsive rendering based on props */}
      <Sidebar
        role={role}
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      {/* On Mobile: ml-0 (full width). On Desktop: ml-20 or ml-64 based on collapse */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out w-full
          ${isCollapsed ? "md:ml-20" : "md:ml-64"} 
          ml-0`}
      >
        <Header
          title={title}
          user={user}
          userRole={role}
          onMenuClick={() => setIsMobileOpen(true)} // Pass toggle to header
        />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
