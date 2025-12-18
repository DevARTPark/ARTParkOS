import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // New prop to specify which roles can enter
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const userStr = localStorage.getItem("artpark_user");
  const user = userStr ? JSON.parse(userStr) : null;
  const location = useLocation();

  // 1. Not Logged In -> Redirect to Login
  if (!user || !user.token) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  // 2. Role Check (Security Layer)
  // If the route has specific allowed roles, and the user doesn't match...
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn(
      `Access Denied: User role '${user.role}' tried to access restricted route.`
    );

    // Redirect them to their CORRECT dashboard
    const dashboardMap: Record<string, string> = {
      founder: "/founder/dashboard",
      reviewer: "/reviewer/dashboard",
      admin: "/admin/dashboard",
      mentor: "/mentor/dashboard",
      supplier: "/supplier/dashboard",
      lab_owner: "/lab-owner/dashboard",
    };

    return <Navigate to={dashboardMap[user.role] || "/"} replace />;
  }

  // 3. Allowed -> Render the page
  return <>{children}</>;
}
