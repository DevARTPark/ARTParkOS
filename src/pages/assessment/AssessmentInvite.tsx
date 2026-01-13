import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

export default function AssessmentInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid Invite Link");
      return;
    }

    const activateAndStart = async () => {
      try {
        // We reuse the existing verify-email endpoint.
        // It validates the token and returns a session JWT.
        const res = await fetch(`${API_URL}/api/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Invalid Invite");

        // 1. Silent Login: Save the received JWT
        localStorage.setItem("token", data.token);
        localStorage.setItem("artpark_user", JSON.stringify(data.user));

        // 2. Redirect straight to the Assessment Page
        // using the userId returned by the backend
        navigate(`/assessment/${data.user.id}`);
      } catch (err: any) {
        console.error(err);
        setError("This invite link has expired or is invalid.");
      }
    };

    activateAndStart();
  }, [token, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-xl font-bold text-gray-900">
          Setting up your session...
        </h2>
        <p className="text-gray-500 mt-2">
          Please wait while we verify your invite.
        </p>
      </div>
    </div>
  );
}
