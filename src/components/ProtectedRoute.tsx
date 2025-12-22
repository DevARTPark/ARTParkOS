import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const location = useLocation();

  // 1. Get User, Token, and Active Context
  const userStr = localStorage.getItem("artpark_user");
  const token = localStorage.getItem("token"); // <--- FIX: Get token directly
  const activeRole = localStorage.getItem("active_role");

  const user = userStr ? JSON.parse(userStr) : null;

  // 2. Authentication Check
  // We check if 'token' exists in localStorage, NOT inside 'user'
  if (!user || !token) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  // 3. Authorization Check (Role Security)
  if (allowedRoles && activeRole) {
    if (!allowedRoles.includes(activeRole)) {
      console.warn(
        `⛔ Access Denied: Role '${activeRole}' cannot access '${location.pathname}'`
      );

      const dashboardMap: Record<string, string> = {
        founder: "/founder/dashboard",
        reviewer: "/reviewer/dashboard",
        admin: "/admin/dashboard",
        mentor: "/mentor/dashboard",
        supplier: "/supplier/dashboard",
        lab_owner: "/lab-owner/dashboard",
      };

      return <Navigate to={dashboardMap[activeRole] || "/"} replace />;
    }
  }

  // 4. Allowed
  return <>{children}</>;
}
