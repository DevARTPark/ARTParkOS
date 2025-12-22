import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { API_URL } from "../../config";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirect = searchParams.get("redirect") || searchParams.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    console.log("🚀 [Login] Starting login process...");
    console.log("📍 [Login] Target API:", `${API_URL}/api/auth/login`);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("📡 [Login] Response Status:", response.status);

      const data = await response.json();
      console.log("📦 [Login] Response Data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // --- DEBUGGING DATA STRUCTURE ---
      console.log("🔍 [Login] User Object:", data.user);
      console.log("🔍 [Login] User Roles (Array):", data.user.roles);
      console.log("🔍 [Login] User Role (Singular - Legacy):", data.user.role);

      // --- HANDLING ROLES ---
      // 1. Try to find the roles array
      let roles = data.user.roles;

      // 2. If no array, check for singular role (Backward Compatibility)
      if (!roles || roles.length === 0) {
        if (data.user.role) {
          console.log(
            "⚠️ [Login] 'roles' array missing. Using singular 'role'."
          );
          roles = [data.user.role];
        } else {
          console.warn(
            "🚨 [Login] NO ROLE FOUND! Defaulting to 'founder' to prevent crash."
          );
          roles = ["founder"];
        }
      }

      const primaryRole = roles[0];
      console.log("👑 [Login] Primary Role Determined:", primaryRole);

      // --- SAVING TO STORAGE ---
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "artpark_user",
        JSON.stringify({ ...data.user, roles })
      );
      localStorage.setItem("active_role", primaryRole);
      console.log("💾 [Login] Saved to LocalStorage.");

      // --- CALCULATING REDIRECT ---
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

      console.log("🚗 [Login] Navigating to:", finalPath);
      navigate(finalPath);
    } catch (err: any) {
      console.error("❌ [Login] ERROR:", err);
      setError(err.message);
      localStorage.removeItem("artpark_user");
      localStorage.removeItem("active_role");
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          ARTPark Debug Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-white text-sm mb-1 block">
              Email Address
            </label>
            <input
              autoFocus
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="founder@artpark.in"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-slate-300 outline-none focus:ring-2 focus:ring-blue-400 border border-transparent focus:border-blue-400 transition"
              required
            />
          </div>

          <div>
            <label className="text-white text-sm mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-slate-300 outline-none focus:ring-2 focus:ring-blue-400 border border-transparent focus:border-blue-400 transition"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 rounded-lg font-semibold transition shadow-lg ${
              isLoading
                ? "bg-gray-600 cursor-not-allowed text-gray-300"
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30"
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
