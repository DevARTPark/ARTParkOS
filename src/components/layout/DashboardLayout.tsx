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
  // State to manage sidebar collapse
  const [isCollapsed, setIsCollapsed] = useState(false);

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
      {/* Pass state and toggle function to Sidebar */}
      <Sidebar
        role={role}
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Adjust margin based on collapsed state */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* Pass userRole prop here */}
        <Header title={title} user={user} userRole={role} />

        <main className="flex-1 p-8 overflow-y-auto">
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