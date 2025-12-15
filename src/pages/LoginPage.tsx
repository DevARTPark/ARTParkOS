import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 1. Updated keys to match URL path segments exactly (e.g., 'lab-owner')
  // 2. Added explicit 'role' field to map to internal system roles (e.g., 'lab_owner')
  const credentials: Record<
    string,
    { password: string; redirect: string; role: string }
  > = {
    founder: {
      password: "12345",
      redirect: "/founder/dashboard",
      role: "founder",
    },
    admin: { password: "12345", redirect: "/admin/dashboard", role: "admin" },
    reviewer: {
      password: "12345",
      redirect: "/reviewer/dashboard",
      role: "reviewer",
    },
    supplier: {
      password: "12345",
      redirect: "/supplier/dashboard",
      role: "supplier",
    },
    mentor: {
      password: "12345",
      redirect: "/mentor/dashboard",
      role: "mentor",
    },
    "lab-owner": {
      password: "12345",
      redirect: "/lab-owner/dashboard",
      role: "lab_owner",
    }, // Key matches URL, Role matches Sidebar
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Verify user credentials exist and password matches
    const userCred = credentials[userId];
    if (!userCred || userCred.password !== password) {
      setError("Invalid credentials. Check the User ID and Password below.");
      return;
    }

    // Determine role implied by redirect (if any)
    const getRoleFromPath = (path: string) => {
      if (!path || !path.startsWith("/")) return null;
      const segs = path.split("/").filter(Boolean);
      return segs.length ? segs[0] : null;
    };

    const desiredPathSegment = getRoleFromPath(redirect); // e.g. "lab-owner"

    // If the redirect requests a different path segment than the user ID, block it
    // We compare userId (e.g. "lab-owner") with path segment (e.g. "lab-owner")
    if (desiredPathSegment && desiredPathSegment !== userId) {
      // Special case: if redirect is root or generic, we might skip this,
      // but for deep links, we enforce the match.
      // We only enforce if the desired segment is a known role key.
      if (credentials[desiredPathSegment]) {
        setError(
          `This page requires a ${desiredPathSegment} account. Please login with '${desiredPathSegment}'.`
        );
        return;
      }
    }

    // All good: persist using the MAPPED role (e.g., lab_owner)
    const auth = { userId, role: userCred.role };
    localStorage.setItem("artpark_user", JSON.stringify(auth));

    // Navigate
    const target = redirect === "/" ? userCred.redirect : redirect;
    navigate(target);
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
              placeholder="e.g. founder, lab-owner"
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

        <div className="text-sm text-slate-400 mt-6 bg-black/20 p-4 rounded-lg">
          <p className="font-semibold mb-2 text-white">Demo Credentials:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>
              User ID: <strong>founder</strong> / <strong>admin</strong> /{" "}
              <strong>reviewer</strong>
            </li>
            <li>
              User ID: <strong>supplier</strong> / <strong>mentor</strong>
            </li>
            <li>
              User ID: <strong>lab-owner</strong> (Not 'lab')
            </li>
            <li className="mt-2 text-white">
              Password: <strong>12345</strong> (for all)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
