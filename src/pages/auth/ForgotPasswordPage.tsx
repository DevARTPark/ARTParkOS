import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(
        "http://localhost:3000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // In real life, this message says "Check email".
      // For dev, we show the link in the backend console.
      setMessage(
        "A reset link has been simulated! Check your Backend Terminal."
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-4 text-center">
          Reset Password
        </h1>
        <p className="text-slate-300 text-sm mb-6 text-center">
          Enter your email to receive a reset link.
        </p>

        {message && (
          <div className="p-3 mb-4 bg-green-500/20 text-green-200 border border-green-500/50 rounded text-sm text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="p-3 mb-4 bg-red-500/20 text-red-200 border border-red-500/50 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white text-sm block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            disabled={isLoading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm text-slate-400 hover:text-white transition"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
