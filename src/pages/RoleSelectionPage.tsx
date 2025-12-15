import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Layout, ShieldCheck, UserCheck } from "lucide-react";

/**
 * Role selection landing page.
 * If user is authenticated -> navigate directly to role dashboard.
 * If not -> navigate to /login?next=<target>
 */
export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("auth_token"); // replace with real auth check

  function goTo(target: string) {
    if (isAuthenticated) {
      navigate(target);
    } else {
      navigate(`/login?next=${encodeURIComponent(target)}`);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ARTPark Portal
          </h1>
          <p className="text-slate-400 text-lg">
            Select your role to enter the portal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => goTo("/founder/dashboard")}
            className="group bg-white/5 rounded-2xl p-8 hover:bg-white/10 transition-transform transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Layout className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Founder</h2>
              <p className="text-slate-300 mb-6">
                Manage your startup, track TRL progress, and access resources.
              </p>
              <div className="flex items-center text-blue-400 font-semibold group-hover:text-blue-300">
                Enter Dashboard <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </button>

          <button
            onClick={() => goTo("/admin/dashboard")}
            className="group bg-white/5 rounded-2xl p-8 hover:bg-white/10 transition-transform transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Admin</h2>
              <p className="text-slate-300 mb-6">
                Oversee portfolio and platform resources.
              </p>
              <div className="flex items-center text-purple-400 font-semibold group-hover:text-purple-300">
                Enter Dashboard <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </button>

          <button
            onClick={() => goTo("/reviewer/dashboard")}
            className="group bg-white/5 rounded-2xl p-8 hover:bg-white/10 transition-transform transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Reviewer</h2>
              <p className="text-slate-300 mb-6">
                Evaluate assessments and validate TRL levels.
              </p>
              <div className="flex items-center text-emerald-400 font-semibold group-hover:text-emerald-300">
                Enter Dashboard <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
