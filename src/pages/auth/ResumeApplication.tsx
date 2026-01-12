import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useApplicationStore } from "../../store/useApplicationStore"; // Adjust path if you placed store elsewhere
import { API_URL } from "../../config"; // Use your main app's config

export default function ResumeApplication() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  // Access store actions to hydrate state
  const {
    setRole,
    updateFounder,
    updateInnovator,
    updateVenture,
    updateUploads,
    updateDeclarations,
    resetForm,
  } = useApplicationStore();

  useEffect(() => {
    const hydrateAndRedirect = async () => {
      // 1. If no token, check if user is already logged in via main app
      const existingToken = localStorage.getItem("token");
      const activeToken = token || existingToken;

      if (!activeToken) {
        navigate("/login");
        return;
      }

      resetForm();

      try {
        // A. Store Token if it came from URL
        if (token) {
          localStorage.setItem("token", token);
        }

        // B. Decode Token to get User ID
        // Note: In a real app, use a proper jwt-decode library if available,
        // but this simple method works for standard JWTs.
        const payload = JSON.parse(atob(activeToken.split(".")[1]));
        const userId = payload.userId || payload.id;
        const email = payload.email;

        // Ensure user info is stored
        localStorage.setItem(
          "artpark_user",
          JSON.stringify({ id: userId, email })
        );

        // C. Fetch Existing Application Data
        const response = await fetch(
          `${API_URL}/api/onboarding/application?userId=${userId}`
        );

        if (response.ok) {
          const savedData = await response.json();

          if (savedData && Object.keys(savedData).length > 0) {
            // D. Hydrate Store (Restore progress)
            if (savedData.role) setRole(savedData.role);
            if (savedData.founder) updateFounder(savedData.founder);
            if (savedData.innovator) updateInnovator(savedData.innovator);
            if (savedData.venture) updateVenture(savedData.venture);
            if (savedData.uploads) updateUploads(savedData.uploads);
            if (savedData.declarations)
              updateDeclarations(savedData.declarations);

            // E. Redirect to appropriate track
            const targetPath =
              savedData.role === "innovator"
                ? "/apply/innovator"
                : "/apply/founder";
            navigate(targetPath);
            return;
          }
        }

        // F. Fallback: If no saved data, default to Founder track
        navigate("/apply/founder");
      } catch (error) {
        console.error("Failed to resume application:", error);
        navigate("/login");
      }
    };

    hydrateAndRedirect();
  }, [
    token,
    navigate,
    setRole,
    updateFounder,
    updateInnovator,
    updateVenture,
    updateUploads,
    updateDeclarations,
    resetForm,
  ]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800">
          Resuming your application...
        </h2>
        <p className="text-gray-500">
          Please wait while we retrieve your data.
        </p>
      </div>
    </div>
  );
}
