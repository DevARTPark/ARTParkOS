import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. Call your Backend API
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // 2. Login Success: Save Token & User Info
      // We save it as 'artpark_user' to match your existing app logic
      localStorage.setItem(
        "artpark_user",
        JSON.stringify({
          ...data.user,
          token: data.token,
        })
      );

      // 3. Navigate to Dashboard
      navigate(data.user.role === "founder" ? "/founder/dashboard" : redirect);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          ARTPark Portal Login
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
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-slate-300 outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-slate-300 outline-none focus:ring-2 focus:ring-blue-400"
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
            className={`w-full py-2 rounded-lg font-semibold transition ${
              isLoading
                ? "bg-gray-500 cursor-not-allowed text-gray-200"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-sm text-slate-400 mt-6 text-center">
          <p>Don't have an account?</p>
          <p className="text-xs mt-1">Contact admin@artpark.in for access.</p>
        </div>
      </div>
    </div>
  );
}
