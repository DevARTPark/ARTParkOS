import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

// Auth & Layout Components
import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import SetPasswordPage from "./pages/auth/SetPasswordPage";
import { UnifiedProfileSettings } from "./pages/common/UnifiedProfileSettings";

// --- FOUNDER PAGES ---
import { FounderDashboard } from "./pages/founder/FounderDashboard";
import { AIRLAssessment } from "./pages/founder/AIRLAssessment";
import { FounderProjects } from "./pages/founder/FounderProjects";
import { FounderFinance } from "./pages/founder/FounderFinance";
import { FounderTeam } from "./pages/founder/FounderTeam";
import { FounderReviews } from "./pages/founder/FounderReviews";
// import { FounderSettings } from "./pages/founder/FounderSettings";
import { FounderOtherStartups } from "./pages/founder/FounderOtherStartups";
import { FounderProjectDetail } from "./pages/founder/FounderProjectDetail";

// --- NEW PORTAL PAGES ---
import FacilitiesHub from "./pages/founder/facilities/FacilitiesHub";
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
import NotFoundPage from "./pages/NotFoundPage";

// --- ADMIN PAGES ---
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminPortfolio } from "./pages/admin/AdminPortfolio";
import { AdminFinancials } from "./pages/admin/AdminFinancials";
import { AdminReports } from "./pages/admin/AdminReports";
import { AdminNetwork } from "./pages/admin/AdminNetwork";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { AdminReviewsResources } from "./pages/admin/AdminReviewsResources";
import { TotalFundingSanctioned } from "./pages/admin/TotalFundingSanctioned";
import { FundsReceived } from "./pages/admin/FundsReceived";
import { FundsAllocated } from "./pages/admin/FundsAllocated";
import { FundsAvailable } from "./pages/admin/FundsAvailable"; // <--- ADDED IMPORT

// --- REVIEWER PAGES ---
import { ReviewerDashboard } from "./pages/reviewer/ReviewerDashboard";
import { AssessmentReview } from "./pages/reviewer/AssessmentReview";
import { ReviewerTasks } from "./pages/reviewer/ReviewerTasks";
import { ReviewerPortfolio } from "./pages/reviewer/ReviewerPortfolio";
import { ReviewerStartupDetail } from "./pages/reviewer/ReviewerStartupDetail";
import { ReviewerUsers } from "./pages/reviewer/ReviewerUsers";
import { ReviewerCalendar } from "./pages/reviewer/ReviewerCalendar";
import { ReviewerSettings } from "./pages/reviewer/ReviewerSettings";
import { ReviewerAssessmentConfig } from "./pages/reviewer/ReviewerAssessmentConfig";
import { ReviewerInvitePage } from "./pages/reviewer/ReviewerInvitePage";
import { ReviewerResources } from "./pages/reviewer/ReviewerResources";
import { ReviewerTaskPool } from "./pages/reviewer/ReviewerTaskPool";

// --- SUPPLIER PAGES ---
import SupplierDashboard from "./pages/supplier/SupplierDashboard";
import ProfileEditPage from "./pages/supplier/ProfileEditPage";
import ProfilePage from "./pages/supplier/ProfilePage";
import ListingsPage from "./pages/supplier/ListingsPage";
import ListingFormPage from "./pages/supplier/ListingFormPage";
import SupplierSettings from "./pages/supplier/SupplierSettings";

// --- MENTOR PAGES ---
import MentorDashboard from "./pages/mentor/MentorDashboard";
import SchedulePage from "./pages/mentor/SchedulePage";
import SessionListPage from "./pages/mentor/SessionListPage";
import SessionDetailPage from "./pages/mentor/SessionDetailPage";
import MentorProfilePage from "./pages/mentor/ProfilePage";
import MentorProfileEditPage from "./pages/mentor/ProfileEditPage";

// --- LAB-OWNER PAGES ---
import LabOwnerDashboard from "./pages/lab-owner/LabOwnerDashboard";
import LabServicesPage from "./pages/lab-owner/LabServicesPage";
import LabBookingsPage from "./pages/lab-owner/LabBookingsPage";
import LabSettings from "./pages/lab-owner/LabSettings";
import LabCalendarPage from "./pages/lab-owner/LabCalendarPage";

// --- Onboarding PAGES ---
import ApplicationEngine from "./pages/onboarding/ApplicationEngine";
import { APPLICATION_FLOW } from "./data/onboarding/applicationFlow";
import { INNOVATOR_FLOW } from "./data/onboarding/innovatorFlow";
import ResumeApplication from "./pages/auth/ResumeApplication";
import ApplicationSuccess from "./pages/onboarding/ApplicationSuccess";
import AssessmentPage from "./pages/assessment/AssessmentPage";
import OnboardingAuthPage from "./pages/auth/OnboardingAuthPage";
import VerifyEmailHandler from "./pages/auth/VerifyEmailHandler";
import AssessmentInvite from "./pages/assessment/AssessmentInvite";

// --- Expert PAGES ---
import ReviewerApplicantList from "./pages/reviewer/ReviewerApplicantList";
import ReviewerApplicantDetail from "./pages/reviewer/ReviewerApplicantDetail";
import ExpertReviewPage from "./pages/expert/ExpertReviewPage"; // Public Route
import AdminApprovedList from "./pages/admin/AdminApprovedList";
import AdminFinalView from "./pages/admin/AdminFinalView";

// Mock Data Seeder
import { seedMockSupplierData } from "./data/mockSupplierData";

if (import.meta.env.MODE !== "production") {
  seedMockSupplierData();
}

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/set-password" element={<SetPasswordPage />} />
        <Route path="/apply" element={<OnboardingAuthPage />} />
        <Route path="/verify-email" element={<VerifyEmailHandler />} />

        {/* --- FOUNDER ROUTES --- */}
        <Route
          path="/founder/dashboard"
          element={
            <ProtectedRoute allowedRoles={["founder"]}>
              <FounderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/assessment"
          element={
            <ProtectedRoute allowedRoles={["founder"]}>
              <AIRLAssessment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/projects"
          element={
            <ProtectedRoute allowedRoles={["founder"]}>
              <FounderProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/finance"
          element={
            <ProtectedRoute allowedRoles={["founder"]}>
              <FounderFinance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/my-team"
          element={
            <ProtectedRoute allowedRoles={["founder"]}>
              <FounderTeam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/reviews"
          element={
            <ProtectedRoute allowedRoles={["founder"]}>
              <FounderReviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/settings"
          element={
            <ProtectedRoute allowedRoles={["founder"]}>
              <UnifiedProfileSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/ecosystem"
          element={
            <ProtectedRoute allowedRoles={["founder"]}>
              <FounderOtherStartups />
            </ProtectedRoute>
          }
        />

        {/* Facilities Hub & Subpages */}
        <Route
          path="/founder/facilities"
          element={
            <ProtectedRoute allowedRoles={["founder"]}>
              <FacilitiesHub />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/facilities/in-house"
          element={
            <ProtectedRoute allowedRoles={["founder"]}>
              <FacilityListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/facilities/:id"
          element={
            <ProtectedRoute allowedRoles={["founder"]}>
              <FacilityDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/facilities/:id/booking"
          element={
            <ProtectedRoute allowedRoles={["founder"]}>
              <FacilityBookingPage />
            </ProtectedRoute>
          }
        />

        {/* Labs */}
        <Route
          path="/founder/labs"
          element={
            <ProtectedRoute allowedRoles={["founder"]}>
              <TestLabListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/labs/:id"
          element={
            <ProtectedRoute allowedRoles={["founder"]}>
              <TestLabDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/labs/:id/booking"
          element={
            <ProtectedRoute allowedRoles={["founder"]}>
              <TestLabBookingPage />
            </ProtectedRoute>
          }
        />

        {/* Mentors */}
        <Route
          path="/founder/mentors"
          element={
            <ProtectedRoute allowedRoles={["founder"]}>
              <MentorListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/mentors/:id"
          element={
            <ProtectedRoute allowedRoles={["founder"]}>
              <MentorDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Software */}
        <Route
          path="/founder/software"
          element={
            <ProtectedRoute allowedRoles={["founder"]}>
              <SoftwareListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/software/:id"
          element={
            <ProtectedRoute allowedRoles={["founder"]}>
              <SoftwareDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Suppliers */}
        <Route
          path="/founder/suppliers"
          element={
            <ProtectedRoute allowedRoles={["founder"]}>
              <SupplierListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/suppliers/:id"
          element={
            <ProtectedRoute allowedRoles={["founder"]}>
              <SupplierDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Knowledge */}
        <Route
          path="/founder/knowledge-ai"
          element={
            <ProtectedRoute allowedRoles={["founder"]}>
              <KnowledgeAIAssistantPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/founder/project/:id"
          element={
            <ProtectedRoute allowedRoles={["founder"]}>
              <FounderProjectDetail />
            </ProtectedRoute>
          }
        />

        {/* --- ADMIN ROUTES --- */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/portfolio"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPortfolio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/financials"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminFinancials />
            </ProtectedRoute>
          }
        />
        {/* ADDED ROUTE FOR TOTAL FUNDING SANCTIONED */}
        <Route
          path="/admin/funding/total-sanctioned"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <TotalFundingSanctioned />
            </ProtectedRoute>
          }
        />
        {/* ADDED ROUTE FOR FUNDS RECEIVED */}
        <Route
          path="/admin/funding/received"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <FundsReceived />
            </ProtectedRoute>
          }
        />
        {/* ADDED ROUTE FOR FUNDS ALLOCATED */}
        <Route
          path="/admin/funding/allocated"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <FundsAllocated />
            </ProtectedRoute>
          }
        />
        {/* ADDED ROUTE FOR FUNDS AVAILABLE */}
        <Route
          path="/admin/funding/available"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <FundsAvailable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/network"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminNetwork />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UnifiedProfileSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reviews-resources"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminReviewsResources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/onboarding"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminApprovedList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/onboarding/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminFinalView />
            </ProtectedRoute>
          }
        />

        {/* --- REVIEWER ROUTES --- */}
        <Route
          path="/reviewer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["reviewer"]}>
              <ReviewerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/tasks"
          element={
            <ProtectedRoute allowedRoles={["reviewer"]}>
              <ReviewerTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/portfolio"
          element={
            <ProtectedRoute allowedRoles={["reviewer"]}>
              <ReviewerPortfolio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/portfolio/:id"
          element={
            <ProtectedRoute allowedRoles={["reviewer"]}>
              <ReviewerStartupDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/resources"
          element={
            <ProtectedRoute allowedRoles={["reviewer"]}>
              <ReviewerResources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/users"
          element={
            <ProtectedRoute allowedRoles={["reviewer"]}>
              <ReviewerUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/calendar"
          element={
            <ProtectedRoute allowedRoles={["reviewer"]}>
              <ReviewerCalendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/review/:id"
          element={
            <ProtectedRoute allowedRoles={["reviewer"]}>
              <AssessmentReview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/settings"
          element={
            <ProtectedRoute allowedRoles={["reviewer"]}>
              <UnifiedProfileSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/assessment-config"
          element={
            <ProtectedRoute allowedRoles={["reviewer"]}>
              <ReviewerAssessmentConfig />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/invite"
          element={
            <ProtectedRoute allowedRoles={["reviewer"]}>
              <ReviewerInvitePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/resources"
          element={
            <ProtectedRoute>
              <ReviewerResources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/pool"
          element={
            <ProtectedRoute>
              <ReviewerTaskPool />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/applications"
          element={
            <ProtectedRoute allowedRoles={["reviewer"]}>
              <ReviewerApplicantList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/applications/:id"
          element={
            <ProtectedRoute allowedRoles={["reviewer"]}>
              <ReviewerApplicantDetail />
            </ProtectedRoute>
          }
        />

        {/* --- SUPPLIER ROUTES --- */}
        <Route
          path="/supplier/dashboard"
          element={
            <ProtectedRoute allowedRoles={["supplier"]}>
              <SupplierDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/profile/edit"
          element={
            <ProtectedRoute allowedRoles={["supplier"]}>
              <ProfileEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/profile"
          element={
            <ProtectedRoute allowedRoles={["supplier"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/listings"
          element={
            <ProtectedRoute allowedRoles={["supplier"]}>
              <ListingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/listings/new"
          element={
            <ProtectedRoute allowedRoles={["supplier"]}>
              <ListingFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/listings/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["supplier"]}>
              <ListingFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/settings"
          element={
            <ProtectedRoute allowedRoles={["supplier"]}>
              <UnifiedProfileSettings />
            </ProtectedRoute>
          }
        />

        {/* --- MENTOR ROUTES --- */}
        <Route
          path="/mentor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["mentor"]}>
              <MentorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/schedule"
          element={
            <ProtectedRoute allowedRoles={["mentor"]}>
              <SchedulePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/sessions"
          element={
            <ProtectedRoute allowedRoles={["mentor"]}>
              <SessionListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/sessions/:id"
          element={
            <ProtectedRoute allowedRoles={["mentor"]}>
              <SessionDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/profile"
          element={
            <ProtectedRoute allowedRoles={["mentor"]}>
              <MentorProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/profile/edit"
          element={
            <ProtectedRoute allowedRoles={["mentor"]}>
              <UnifiedProfileSettings />
            </ProtectedRoute>
          }
        />

        {/* --- LAB OWNER ROUTES --- */}
        <Route
          path="/lab-owner/dashboard"
          element={
            <ProtectedRoute allowedRoles={["lab_owner"]}>
              <LabOwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lab-owner/services"
          element={
            <ProtectedRoute allowedRoles={["lab_owner"]}>
              <LabServicesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lab-owner/bookings"
          element={
            <ProtectedRoute allowedRoles={["lab_owner"]}>
              <LabBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lab-owner/settings"
          element={
            <ProtectedRoute allowedRoles={["lab_owner"]}>
              <UnifiedProfileSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lab-owner/calendar"
          element={
            <ProtectedRoute allowedRoles={["lab_owner"]}>
              <LabCalendarPage />
            </ProtectedRoute>
          }
        />

        {/* --- ONBOARDING WIZARD --- */}
        <Route
          path="/apply/founder"
          element={
            <ProtectedRoute allowedRoles={["applicant", "founder"]}>
              <ApplicationEngine
                flowConfig={APPLICATION_FLOW}
                trackTitle="Founder Track"
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply/innovator"
          element={
            <ProtectedRoute allowedRoles={["applicant", "innovator"]}>
              <ApplicationEngine
                flowConfig={INNOVATOR_FLOW}
                trackTitle="Innovator Track"
              />
            </ProtectedRoute>
          }
        />

        <Route path="/resume-application" element={<ResumeApplication />} />

        <Route path="/assessment-start" element={<AssessmentInvite />} />

        <Route path="/expert/review" element={<ExpertReviewPage />} />

        <Route
          path="/application-submitted"
          element={
            <ProtectedRoute
              allowedRoles={["applicant", "founder", "innovator"]}
            >
              <ApplicationSuccess />
            </ProtectedRoute>
          }
        />

        {/* Assessment Page (Dynamic ID) */}
        <Route
          path="/assessment/:id"
          element={
            <ProtectedRoute
              allowedRoles={["applicant", "founder", "innovator"]}
            >
              <AssessmentPage />
            </ProtectedRoute>
          }
        />

        {/* 404 not found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}