// src/pages/auth/VerifyEmailHandler.tsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useApplicationStore } from "../../store/useApplicationStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function VerifyEmailHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"verifying" | "error">("verifying");

  const { resetForm } = useApplicationStore();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        // Success: Log them in
        localStorage.setItem("token", data.token);
        localStorage.setItem("artpark_user", JSON.stringify(data.user));

        // Reset form to ensure clean state
        resetForm();

        // Redirect based on intent (defaulting to founder if unknown)
        // You might want to save their intended role in localStorage during signup to recover it here
        navigate("/apply/founder");
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    };

    verifyToken();
  }, [token, navigate, resetForm]);

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Verification Failed
          </h2>
          <p className="text-gray-600 mb-6">The link is invalid or expired.</p>
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800">
          Verifying your email...
        </h2>
      </div>
    </div>
  );
}
