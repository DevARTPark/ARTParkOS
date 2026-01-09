import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Lock,
  Mail,
  ArrowRight,
  Loader,
  Rocket,
  CheckCircle2,
} from "lucide-react";
import artparkLogo from "../../../public/artpark_in_logo.jpg";
import { API_URL } from "../../config";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirect = searchParams.get("redirect") || searchParams.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Handle Roles
      const roles =
        data.user.roles && data.user.roles.length > 0
          ? data.user.roles
          : ["founder"];

      const primaryRole = roles[0];

      // Save Data
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "artpark_user",
        JSON.stringify({ ...data.user, roles })
      );
      localStorage.setItem("active_role", primaryRole);

      if (primaryRole === "applicant") {
        // Redirect to Onboarding App with token so they are auto-logged in
        // Change this URL if your onboarding app is hosted elsewhere
        const onboardingUrl =
          import.meta.env.VITE_ONBOARDING_URL || "http://localhost:5173";

        // We pass the token so the Onboarding App can auto-login the user
        window.location.href = `${onboardingUrl}/resume?token=${data.token}`;
        return;
      }

      // Redirect Logic
      let finalPath = redirect;
      const dashboardMap: Record<string, string> = {
        founder: "/founder/dashboard",
        reviewer: "/reviewer/dashboard",
        admin: "/admin/dashboard",
        mentor: "/mentor/dashboard",
        supplier: "/supplier/dashboard",
        lab_owner: "/lab-owner/dashboard",
      };

      if (!finalPath || finalPath === "/" || finalPath === "/login") {
        finalPath = dashboardMap[primaryRole] || "/founder/dashboard";
      }

      navigate(finalPath);
    } catch (err: any) {
      setError(err.message);
      localStorage.removeItem("artpark_user");
      localStorage.removeItem("active_role");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  // The Correct URL
  const ONBOARDING_URL = "https://artpark-onboarding.vercel.app/";

  return (
    <div className="min-h-screen flex w-full">
      {/* --- LEFT SIDEBAR: New Applicant (Compact) --- */}
      <div className="hidden lg:flex w-80 bg-slate-900 text-white flex-col justify-center px-6 relative z-20 shadow-2xl">
        {/* Decorative elements for the sidebar */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-20%] w-60 h-60 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-20%] w-60 h-60 bg-purple-500 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/50">
            <Rocket className="w-6 h-6 text-white" />
          </div>

          <h2 className="text-xl font-bold mb-3">New to ARTPARK?</h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Join the ecosystem. Apply for Incubation, Funding, or the Innovator
            Program today.
          </p>

          <a
            href={ONBOARDING_URL} // <--- UPDATED LINK (Desktop)
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 group"
          >
            Apply Now
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>

          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Test Labs Access</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Seed Funding</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Expert Mentorship</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: Main Login Area (Original Card) --- */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-4 relative">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-100/50 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-100/50 rounded-full blur-3xl delay-700" />
        </div>

        {/* ORIGINAL LOGIN CARD */}
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative z-10 border border-gray-100">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-4 p-2">
              <img
                src={artparkLogo}
                alt="ARTPARK"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-1">
              Sign in to continue to ARTPARK OS
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between ml-1">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account? Contact Admin @{" "}
              <a
                href="mailto:dev@artpark.in"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                dev@artpark.in
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Footer for Apply Link (Only visible on small screens) */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 text-center z-50">
        <a
          href={ONBOARDING_URL}
          target="_blank"
          className="text-blue-600 font-bold text-sm"
        >
          New here? Apply as Applicant →
        </a>
      </div>
    </div>
  );
}
