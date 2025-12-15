import React, { useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // next from query param (e.g. /login?next=/founder/dashboard)
  const nextQuery = searchParams.get("next");

  // state.from comes from ProtectedRoute: { from: location }
  const fromState = (location.state as any)?.from;
  const destination =
    nextQuery ||
    (fromState
      ? `${(fromState as any).pathname}${(fromState as any).search || ""}`
      : "/dashboard");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: replace with real auth call
      // Simulate success
      await new Promise((r) => setTimeout(r, 400));
      // store a token (replace with real token)
      localStorage.setItem("auth_token", "fake-token");
      // navigate to the intended destination
      navigate(destination, { replace: true });
    } catch (err) {
      // handle error - show message
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/5 p-6 rounded-lg"
      >
        <h2 className="text-xl text-white mb-4">Sign in</h2>

        <label className="block mb-2 text-sm text-slate-300">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded bg-slate-800 text-white"
        />

        <label className="block mb-2 text-sm text-slate-300">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded bg-slate-800 text-white"
        />

        <button
          type="submit"
          className="w-full py-2 rounded bg-indigo-600 text-white"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
