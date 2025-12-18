import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Layout,
  ShieldCheck,
  UserCheck,
  Users,
  Calendar,
  Building2,
} from "lucide-react";

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem("artpark_user");
  const isAuthenticated = !!userStr;

  // Navigate function with Strict Role Enforcement
  function goTo(target: string, role: string) {
    if (isAuthenticated) {
      // If already logged in, just go there (ProtectedRoute will handle security)
      navigate(target);
    } else {
      // If logging in, tell Login Page which role we EXPECT
      navigate(
        `/login?redirect=${encodeURIComponent(target)}&expectedRole=${role}`
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ARTPark Portal
          </h1>
          <p className="text-slate-400 text-lg">
            Select your role to enter the portal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Founder */}
          <button
            onClick={() => goTo("/founder/dashboard", "founder")}
            className="group text-left"
          >
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-2xl h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Layout className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Founder</h2>
              <p className="text-slate-300 mb-8 flex-1">
                Manage your startup, track AIRL progress.
              </p>
              <div className="flex items-center text-blue-400 font-semibold group-hover:text-blue-300">
                Founder Login <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </button>

          {/* Admin */}
          <button
            onClick={() => goTo("/admin/dashboard", "admin")}
            className="group text-left"
          >
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-2xl h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Admin</h2>
              <p className="text-slate-300 mb-8 flex-1">
                Oversee portfolio and platform resources.
              </p>
              <div className="flex items-center text-purple-400 font-semibold group-hover:text-purple-300">
                Admin Login <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </button>

          {/* Reviewer */}
          <button
            onClick={() => goTo("/reviewer/dashboard", "reviewer")}
            className="group text-left"
          >
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-2xl h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Reviewer</h2>
              <p className="text-slate-300 mb-8 flex-1">
                Evaluate assessments and validate AIRL levels.
              </p>
              <div className="flex items-center text-emerald-400 font-semibold group-hover:text-emerald-300">
                Reviewer Login <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </button>

          {/* Supplier */}
          <button
            onClick={() => goTo("/supplier/dashboard", "supplier")}
            className="group text-left"
          >
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-2xl h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Supplier</h2>
              <p className="text-slate-300 mb-8 flex-1">
                List your offerings and capabilities.
              </p>
              <div className="flex items-center text-cyan-400 font-semibold group-hover:text-cyan-300">
                Supplier Login <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </button>

          {/* Mentor */}
          <button
            onClick={() => goTo("/mentor/dashboard", "mentor")}
            className="group text-left"
          >
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-2xl h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Mentor</h2>
              <p className="text-slate-300 mb-8 flex-1">
                Manage schedules and mentorship sessions.
              </p>
              <div className="flex items-center text-indigo-400 font-semibold group-hover:text-indigo-300">
                Mentor Login <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </button>

          {/* Lab Owner */}
          <button
            onClick={() => goTo("/lab-owner/dashboard", "lab_owner")}
            className="group text-left"
          >
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-2xl h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Lab Owner</h2>
              <p className="text-slate-300 mb-8 flex-1">
                Manage facility equipment and bookings.
              </p>
              <div className="flex items-center text-orange-400 font-semibold group-hover:text-orange-300">
                Lab Owner Login <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
