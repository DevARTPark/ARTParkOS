import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Dummy role-based credentials
  const credentials: Record<string, { password: string; redirect: string }> = {
    founder: { password: "12345", redirect: "/founder/dashboard" },
    admin: { password: "12345", redirect: "/admin/dashboard" },
    reviewer: { password: "12345", redirect: "/reviewer/dashboard" },
    supplier: { password: "12345", redirect: "/supplier/dashboard" },
    mentor: { password: "12345", redirect: "/mentor/dashboard" },
    lab: { password: "12345", redirect: "/lab/dashboard" },
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (credentials[userId] && credentials[userId].password === password) {
      // Save minimal auth info (replace with real auth later)
      const auth = { userId, role: userId };
      localStorage.setItem("artpark_user", JSON.stringify(auth));

      // Prefer the redirect param (explicit), else role-based default
      const target = redirect === "/" ? credentials[userId].redirect : redirect;
      navigate(target);
    } else {
      setError(
        "Invalid credentials. Try: user_id/password = founder/12345 (or admin/reviewer...)"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Login to ARTPark Portal
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-white text-sm mb-1 block">User ID</label>
            <input
              autoFocus
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g. founder, admin, reviewer"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-slate-300 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="text-white text-sm mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="12345"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-slate-300 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-slate-400 mt-4">
          Demo accounts:{" "}
          <strong>founder/admin/reviewer/supplier/mentor/lab</strong> — password{" "}
          <strong>12345</strong>
        </p>
      </div>
    </div>
  );
}
