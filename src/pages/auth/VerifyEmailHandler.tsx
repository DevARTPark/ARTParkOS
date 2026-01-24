import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useApplicationStore } from "../../store/useApplicationStore";
import { API_URL } from "../../config";

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
        // 1. Verify Email
        const res = await fetch(`${API_URL}/api/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        // 2. Save Token (Auto-login)
        localStorage.setItem("token", data.token);
        localStorage.setItem("artpark_user", JSON.stringify(data.user));

        // 3. Clear old data
        resetForm();

        // 4. FETCH APPLICATION TO CHECK TRACK
        // We need to know if they are 'startup' (Founder) or 'innovator'
        try {
          const appRes = await fetch(
            `${API_URL}/api/onboarding/application?userId=${data.user.id}`,
            {
              headers: {
                Authorization: `Bearer ${data.token}`,
                "Content-Type": "application/json",
              },
            },
          );

          if (appRes.ok) {
            const appData = await appRes.json();
            // Check the track stored in step 1
            const track = appData?.venture?.track;

            if (track === "innovator") {
              navigate("/apply/innovator");
            } else {
              navigate("/apply/founder");
            }
          } else {
            // Fallback if fetch fails
            navigate("/apply/founder");
          }
        } catch (e) {
          // Fallback if network error
          navigate("/apply/founder");
        }
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
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Verification Link Expired
          </h2>
          <p className="text-gray-600 mb-6">
            This link is invalid or has already been used. Please try logging in
            directly.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800">
          Verifying your email...
        </h2>
        <p className="text-gray-500 mt-2 text-sm">Please wait a moment</p>
      </div>
    </div>
  );
}
