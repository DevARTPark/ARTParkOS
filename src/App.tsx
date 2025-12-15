import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Auth & Layout Components
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

// --- FOUNDER PAGES ---
import { FounderDashboard } from "./pages/founder/FounderDashboard";
import { TRLAssessment } from "./pages/founder/TRLAssessment";
import { FounderProjects } from "./pages/founder/FounderProjects";
import { FounderFinance } from "./pages/founder/FounderFinance";
import { FounderTeam } from "./pages/founder/FounderTeam";
import { FounderReviews } from "./pages/founder/FounderReviews";

// --- NEW PORTAL PAGES ---
import FacilitiesHub from "./pages/founder/facilities/FacilitiesHub"; // New Hub Page
import TestLabListPage from "./pages/founder/labs/TestLabListPage";
import TestLabDetailPage from "./pages/founder/labs/TestLabDetailPage";
import TestLabBookingPage from "./pages/founder/labs/TestLabBookingPage";
import FacilityListPage from "./pages/founder/facilities/FacilityListPage";
import FacilityDetailPage from "./pages/founder/facilities/FacilityDetailPage";
import FacilityBookingPage from "./pages/founder/facilities/FacilityBookingPage";
import MentorListPage from "./pages/founder/mentors/MentorListPage";
import MentorDetailPage from "./pages/founder/mentors/MentorDetailPage";
import SoftwareListPage from "./pages/founder/software/SoftwareListPage";
import SoftwareDetailPage from "./pages/founder/software/SoftwareDetailPage";
import SupplierListPage from "./pages/founder/suppliers/SupplierListPage";
import SupplierDetailPage from "./pages/founder/suppliers/SupplierDetailPage";
import KnowledgeAIAssistantPage from "./pages/founder/knowledge/KnowledgeAIAssistantPage";

// --- ADMIN PAGES ---
import { AdminDashboard } from "./pages/admin/AdminDashboard";

// --- REVIEWER PAGES ---
import { ReviewerDashboard } from "./pages/reviewer/ReviewerDashboard";
import { AssessmentReview } from "./pages/reviewer/AssessmentReview";

// --- SUPPLIER PAGES ---
import SupplierDashboard from "./pages/supplier/SupplierDashboard";
import ProfileEditPage from "./pages/supplier/ProfileEditPage";
import ProfilePage from "./pages/supplier/ProfilePage";
import ListingsPage from "./pages/supplier/ListingsPage";
import ListingFormPage from "./pages/supplier/ListingFormPage";

// Icons for RoleSelection
import { FounderSettings } from "./pages/founder/FounderSettings";
import { ReviewerTasks } from "./pages/reviewer/ReviewerTasks";
import { ReviewerPortfolio } from "./pages/reviewer/ReviewerPortfolio";
import { ReviewerStartupDetail } from "./pages/reviewer/ReviewerStartupDetail";
import { FounderOtherStartups } from "./pages/founder/FounderOtherStartups";
import { ReviewerUsers } from "./pages/reviewer/ReviewerUsers";
import { ReviewerCalendar } from "./pages/reviewer/ReviewerCalendar";
import { ReviewerSettings } from "./pages/reviewer/ReviewerSettings";
import {
  ArrowRight,
  Layout,
  ShieldCheck,
  UserCheck,
  Users,
  Calendar,
  Building2,
} from "lucide-react";

// Mock Data Seeder
import { seedMockSupplierData } from "./data/mockSupplierData";

if (import.meta.env.MODE !== "production") {
  seedMockSupplierData();
}

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
          <a
            href={`/login?redirect=${encodeURIComponent("/founder/dashboard")}`}
            className="group"
          >
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
          <a
            href={`/login?redirect=${encodeURIComponent("/admin/dashboard")}`}
            className="group"
          >
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
          <a
            href={`/login?redirect=${encodeURIComponent(
              "/reviewer/dashboard"
            )}`}
            className="group"
          >
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
        </div>
      </div>
    </div>
  );
}

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/login" element={<LoginPage />} />

        {/* --- FOUNDER ROUTES --- */}
        <Route
          path="/founder/dashboard"
          element={
            <ProtectedRoute>
              <FounderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/assessment"
          element={
            <ProtectedRoute>
              <TRLAssessment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/projects"
          element={
            <ProtectedRoute>
              <FounderProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/finance"
          element={
            <ProtectedRoute>
              <FounderFinance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/my-team"
          element={
            <ProtectedRoute>
              <FounderTeam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/reviews"
          element={
            <ProtectedRoute>
              <FounderReviews />
            </ProtectedRoute>
          }
        />

        {/* --- FACILITIES HUB --- */}
        {/* The main Facilities link now points here */}
        <Route
          path="/founder/facilities"
          element={
            <ProtectedRoute>
              <FacilitiesHub />
            </ProtectedRoute>
          }
        />
        {/* Founder Routes */}
        <Route path="/founder/dashboard" element={<FounderDashboard />} />
        <Route path="/founder/assessment" element={<TRLAssessment />} />
        <Route path="/founder/projects" element={<FounderProjects />} />
        <Route path="/founder/finance" element={<FounderFinance />} />
        <Route path="/founder/my-team" element={<FounderTeam />} />
        <Route path="/founder/reviews" element={<FounderReviews />} />
        <Route path="/founder/settings" element={<FounderSettings />} />
        <Route path="/founder/ecosystem" element={<FounderOtherStartups />} />

        {/* In-House Facilities (Nested under facilities) */}
        <Route
          path="/founder/facilities/in-house"
          element={
            <ProtectedRoute>
              <FacilityListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/facilities/:id"
          element={
            <ProtectedRoute>
              <FacilityDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/facilities/:id/booking"
          element={
            <ProtectedRoute>
              <FacilityBookingPage />
            </ProtectedRoute>
          }
        />

        {/* Test Labs */}
        <Route
          path="/founder/labs"
          element={
            <ProtectedRoute>
              <TestLabListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/labs/:id"
          element={
            <ProtectedRoute>
              <TestLabDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/labs/:id/booking"
          element={
            <ProtectedRoute>
              <TestLabBookingPage />
            </ProtectedRoute>
          }
        />

        {/* Mentors */}
        <Route
          path="/founder/mentors"
          element={
            <ProtectedRoute>
              <MentorListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/mentors/:id"
          element={
            <ProtectedRoute>
              <MentorDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Software */}
        <Route
          path="/founder/software"
          element={
            <ProtectedRoute>
              <SoftwareListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/software/:id"
          element={
            <ProtectedRoute>
              <SoftwareDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Suppliers */}
        <Route
          path="/founder/suppliers"
          element={
            <ProtectedRoute>
              <SupplierListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/suppliers/:id"
          element={
            <ProtectedRoute>
              <SupplierDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Knowledge AI */}
        <Route
          path="/founder/knowledge-ai"
          element={
            <ProtectedRoute>
              <KnowledgeAIAssistantPage />
            </ProtectedRoute>
          }
        />

        {/* --- ADMIN ROUTES --- */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* --- REVIEWER ROUTES --- */}
        <Route
          path="/reviewer/dashboard"
          element={
            <ProtectedRoute>
              <ReviewerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/tasks"
          element={
            <ProtectedRoute>
              <ReviewerTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/review/:id"
          element={
            <ProtectedRoute>
              <AssessmentReview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/portfolio"
          element={
            <ProtectedRoute>
              <ReviewerPortfolio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/portfolio/:id"
          element={
            <ProtectedRoute>
              <ReviewerStartupDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/users"
          element={
            <ProtectedRoute>
              <ReviewerUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/calendar"
          element={
            <ProtectedRoute>
              <ReviewerCalendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/settings"
          element={
            <ProtectedRoute>
              <ReviewerSettings />
            </ProtectedRoute>
          }
        />

        {/* --- SUPPLIER ROUTES --- */}
        <Route
          path="/supplier/dashboard"
          element={
            <ProtectedRoute>
              <SupplierDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/profile/edit"
          element={
            <ProtectedRoute>
              <ProfileEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/listings"
          element={
            <ProtectedRoute>
              <ListingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/listings/new"
          element={
            <ProtectedRoute>
              <ListingFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/listings/:id/edit"
          element={
            <ProtectedRoute>
              <ListingFormPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
