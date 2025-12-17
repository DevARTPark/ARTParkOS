import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

export default function SetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get token and type from URL (e.g. ?token=abc&type=activation)
  const token = searchParams.get("token");
  const type = searchParams.get("type"); // 'activation' or 'reset'

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (password.length < 5)
      return setError("Password must be at least 5 characters");

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000); // Redirect after 3s
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token)
    return <div className="text-white text-center mt-20">Invalid Link</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">
          {type === "activation" ? "Activate Account" : "Reset Password"}
        </h1>
        <p className="text-slate-300 text-sm mb-6 text-center">
          {type === "activation"
            ? "Set up your password to get started."
            : "Enter your new password below."}
        </p>

        {success ? (
          <div className="p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-200 text-center">
            <p className="font-bold">Success!</p>
            <p className="text-sm mt-1">
              Your password has been updated. Redirecting to login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/20 text-red-200 border border-red-500/50 rounded text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="text-white text-sm block mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-white text-sm block mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              disabled={isLoading}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Set Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
