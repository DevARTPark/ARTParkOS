import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import OnboardingAuthPage from "./pages/auth/OnboardingAuthPage";
import VerifyEmailHandler from "./pages/auth/VerifyEmailHandler";

// 1. Import the Unified Engine
import ApplicationEngine from "./pages/ApplicationEngine";

// 2. Import the Configurations
import { APPLICATION_FLOW } from "./features/application/config/applicationFlow";
import { INNOVATOR_FLOW } from "./features/application/config/innovatorFlow";

// 3. Import Store
import { useApplicationStore } from "./store/useApplicationStore";

// --- RESUME HANDLER COMPONENT ---
function ResumeHandler() {
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
      if (!token) {
        navigate("/login");
        return;
      }

      resetForm();

      try {
        // A. Store Token
        localStorage.setItem("token", token);

        // B. Decode Token to get User ID (Simple JWT Decode)
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.userId;
        const email = payload.email;

        // Store minimal user info for ApplicationEngine to use
        localStorage.setItem(
          "artpark_user",
          JSON.stringify({ id: userId, email })
        );

        // C. Fetch Existing Application Data
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const response = await fetch(
          `${API_URL}/api/onboarding/application?userId=${userId}`
        );

        if (response.ok) {
          const savedData = await response.json();

          if (savedData && Object.keys(savedData).length > 0) {
            // D. Hydrate Store (Restore progress)
            // We map the raw JSON back into the Zustand store
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

        // F. Fallback if no data found (New Applicant via Resume Link?)
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

// --- MAIN APP COMPONENT ---
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login page */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login / Role Selection */}
        <Route path="/login" element={<OnboardingAuthPage />} />

        <Route path="/verify-email" element={<VerifyEmailHandler />} />

        {/* FOUNDER TRACK */}
        <Route
          path="/apply/founder"
          element={
            <ApplicationEngine
              flowConfig={APPLICATION_FLOW}
              trackTitle="Founder Track"
            />
          }
        />

        {/* INNOVATOR TRACK */}
        <Route
          path="/apply/innovator"
          element={
            <ApplicationEngine
              flowConfig={INNOVATOR_FLOW}
              trackTitle="Innovator Track"
            />
          }
        />

        {/* RESUME ROUTE (Handled by new component) */}
        <Route path="/resume" element={<ResumeHandler />} />
      </Routes>
    </Router>
  );
}
