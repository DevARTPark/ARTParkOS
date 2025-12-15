import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function isAuthenticated() {
  // simple check — change to more robust check later
  return Boolean(localStorage.getItem("artpark_user"));
}

/**
 * Wrap protected routes:
 * <Route path="/founder/dashboard" element={<ProtectedRoute><FounderDashboard/></ProtectedRoute>} />
 */
export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const loc = useLocation();
  if (!isAuthenticated()) {
    // redirect to login, preserve wanted path
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(loc.pathname)}`}
        replace
      />
    );
  }
  return children;
}
