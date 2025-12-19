import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";

export default function SetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get token from URL (e.g. ?token=abc&type=activation)
  const token = searchParams.get("token");
  const type = searchParams.get("type"); // 'activation' or 'reset'

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 1. Client-side Validation
    if (!token) {
      setError("Invalid or missing token.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // 2. Call Backend API
      console.log("Sending payload:", { token, password }); // Debug log

      const response = await fetch(
        "http://localhost:3000/api/auth/set-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token, // Send the token from URL
            password, // Send the new password
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to set password.");
      }

      setSuccess("Password set successfully! Redirecting to login...");

      // 3. Redirect after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="p-8 bg-white/10 rounded-xl text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Invalid Link</h2>
          <p className="text-slate-300">This link is missing a valid token.</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 text-blue-400 hover:underline"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            {type === "activation" ? "Activate Account" : "Reset Password"}
          </h1>
          <p className="text-slate-300 text-sm mt-2">
            Create a secure password for your account.
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-500/20 text-red-200 border border-red-500/50 rounded text-sm text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 mb-4 bg-green-500/20 text-green-200 border border-green-500/50 rounded text-sm text-center flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password Input */}
          <div>
            <label className="text-white text-sm block mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-4 pr-10 py-2 rounded-lg bg-white/20 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 border border-transparent transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-white text-sm block mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 border border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          <button
            disabled={loading || !!success}
            className={`w-full py-2.5 rounded-lg font-semibold transition shadow-lg ${
              loading || success
                ? "bg-gray-600 cursor-not-allowed text-gray-300"
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30"
            }`}
          >
            {loading ? "Setting Password..." : "Set Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
