import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import AuthLayout from './layouts/AuthLayout'

// Auth pages
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'

// Dashboard
import DashboardPage from './pages/DashboardPage'

// Supplier pages
import SupplierListPage from './pages/suppliers/SupplierListPage'
import SupplierDetailPage from './pages/suppliers/SupplierDetailPage'
import SupplierComparePage from './pages/suppliers/SupplierComparePage'

// Lab pages
import TestLabListPage from './pages/labs/TestLabListPage'
import TestLabDetailPage from './pages/labs/TestLabDetailPage'
import TestLabBookingPage from './pages/labs/TestLabBookingPage'

// Facility pages
import FacilityListPage from './pages/facilities/FacilityListPage'
import FacilityDetailPage from './pages/facilities/FacilityDetailPage'
import FacilityBookingPage from './pages/facilities/FacilityBookingPage'

// Mentor pages
import MentorListPage from './pages/mentors/MentorListPage'
import MentorDetailPage from './pages/mentors/MentorDetailPage'
import MentorBookingPage from './pages/mentors/MentorBookingPage'

// Software pages
import SoftwareListPage from './pages/software/SoftwareListPage'
import SoftwareDetailPage from './pages/software/SoftwareDetailPage'
import SoftwareRequestStatusPage from './pages/software/SoftwareRequestStatusPage'

// Knowledge AI
import KnowledgeAIAssistantPage from './pages/knowledge/KnowledgeAIAssistantPage'

// Utility pages
import ProfilePage from './pages/ProfilePage'
import NotificationsPage from './pages/NotificationsPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* Protected dashboard routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/" element={<DashboardPage />} />
        
        {/* Suppliers */}
        <Route path="/suppliers" element={<SupplierListPage />} />
        <Route path="/suppliers/:id" element={<SupplierDetailPage />} />
        <Route path="/suppliers/compare" element={<SupplierComparePage />} />
        
        {/* Test Labs */}
        <Route path="/labs" element={<TestLabListPage />} />
        <Route path="/labs/:id" element={<TestLabDetailPage />} />
        <Route path="/labs/:id/booking" element={<TestLabBookingPage />} />
        
        {/* Facilities */}
        <Route path="/facilities" element={<FacilityListPage />} />
        <Route path="/facilities/:id" element={<FacilityDetailPage />} />
        <Route path="/facilities/:id/booking" element={<FacilityBookingPage />} />
        
        {/* Mentors */}
        <Route path="/mentors" element={<MentorListPage />} />
        <Route path="/mentors/:id" element={<MentorDetailPage />} />
        <Route path="/mentors/:id/booking" element={<MentorBookingPage />} />
        
        {/* Software */}
        <Route path="/software" element={<SoftwareListPage />} />
        <Route path="/software/:id" element={<SoftwareDetailPage />} />
        <Route path="/software/requests" element={<SoftwareRequestStatusPage />} />
        
        {/* Knowledge AI */}
        <Route path="/knowledge-ai" element={<KnowledgeAIAssistantPage />} />
        
        {/* Utility */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App

