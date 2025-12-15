import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExternalRedirect from "./components/ExternalRedirect";

// pages (assumed to exist in your project)
import { FounderDashboard } from "./pages/founder/FounderDashboard";
import { TRLAssessment } from "./pages/founder/TRLAssessment";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ReviewerDashboard } from "./pages/reviewer/ReviewerDashboard";
import { AssessmentReview } from "./pages/reviewer/AssessmentReview";
import { FounderProjects } from "./pages/founder/FounderProjects";
import { FounderFinance } from "./pages/founder/FounderFinance";
import { FounderTeam } from "./pages/founder/FounderTeam";
import { FounderReviews } from "./pages/founder/FounderReviews";
import {
  ArrowRight,
  Layout,
  ShieldCheck,
  UserCheck,
  Users,
  Calendar,
  Building2,
} from "lucide-react";

function RoleSelection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ARTPark TRL Platform
          </h1>
          <p className="text-slate-400 text-lg">
            Select your role to enter the portal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="/founder/dashboard" className="group">
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-2xl h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Layout className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Founder</h2>
              <p className="text-slate-300 mb-8 flex-1">
                Manage your startup, track TRL progress, and access resources.
              </p>
              <div className="flex items-center text-blue-400 font-semibold group-hover:text-blue-300">
                Enter Dashboard <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </a>
          <a href="/admin/dashboard" className="group">
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-2xl h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Admin</h2>
              <p className="text-slate-300 mb-8 flex-1">
                Oversee portfolio, manage resources, and track ecosystem health.
              </p>
              <div className="flex items-center text-purple-400 font-semibold group-hover:text-purple-300">
                Enter Dashboard <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </a>
          <a href="/reviewer/dashboard" className="group">
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-2xl h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Reviewer</h2>
              <p className="text-slate-300 mb-8 flex-1">
                Evaluate assessments, provide feedback, and validate TRL levels.
              </p>
              <div className="flex items-center text-emerald-400 font-semibold group-hover:text-emerald-300">
                Enter Dashboard <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </a>
          {/* Suppliers */}
          <a
            href="/supplier/dashboard"
            className="group"
            aria-label="Suppliers"
          >
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-2xl h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Suppliers</h2>
              <p className="text-slate-300 mb-6 flex-1">
                Create profile, list offerings with price & MOQ, show
                capabilities, contact & location, and display customer ratings &
                feedback.
              </p>
              <div className="flex items-center text-blue-400 font-semibold group-hover:text-blue-300">
                Go to Suppliers <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </a>
          {/* Mentors */}
          <a href="/mentor/dashboard" className="group" aria-label="Mentors">
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-2xl h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Mentors</h2>
              <p className="text-slate-300 mb-6 flex-1">
                Set available times for meetings, view scheduled calls, and
                upload meeting notes for startups.
              </p>
              <div className="flex items-center text-indigo-400 font-semibold group-hover:text-indigo-300">
                Go to Mentors <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </a>
          {/* Lab Facility Owners */}
          <a
            href="/lab/dashboard"
            className="group"
            aria-label="Lab facility owners"
          >
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-2xl h-full flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Lab Facility Owners
              </h2>
              <p className="text-slate-300 mb-6 flex-1"></p>
              <div className="flex items-center text-rose-400 font-semibold group-hover:text-rose-300">
                Go to Labs <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export function App() {
  const externalFacilitiesUrl = "https://art-park-portal.vercel.app";

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />

        {/* Client-side redirect route: clicking /founder/facilities (NavLink from Sidebar) lands here */}
        <Route
          path="/founder/facilities"
          element={<ExternalRedirect url={externalFacilitiesUrl} />}
        />

        {/* Founder Routes */}
        <Route path="/founder/dashboard" element={<FounderDashboard />} />
        <Route path="/founder/assessment" element={<TRLAssessment />} />
        <Route path="/founder/projects" element={<FounderProjects />} />
        <Route path="/founder/finance" element={<FounderFinance />} />
        <Route path="/founder/my-team" element={<FounderTeam />} />
        <Route path="/founder/reviews" element={<FounderReviews />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Reviewer Routes */}
        <Route path="/reviewer/dashboard" element={<ReviewerDashboard />} />
        <Route path="/reviewer/review/:id" element={<AssessmentReview />} />
      </Routes>
    </Router>
  );
}
