import { ReactNode, useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Store,
  FlaskConical,
  Building2,
  Users,
  Package,
  Brain,
  User,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import { auth } from '@/utils/auth'
import Button from '@/components/ui/Button'
import SearchBar from '@/components/ui/SearchBar'

interface NavItem {
  label: string
  icon: ReactNode
  path: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/dashboard' },
  { label: 'Suppliers', icon: <Store className="h-5 w-5" />, path: '/suppliers' },
  { label: 'Test Labs', icon: <FlaskConical className="h-5 w-5" />, path: '/labs' },
  { label: 'Facilities', icon: <Building2 className="h-5 w-5" />, path: '/facilities' },
  { label: 'Mentors', icon: <Users className="h-5 w-5" />, path: '/mentors' },
  { label: 'Software', icon: <Package className="h-5 w-5" />, path: '/software' },
  { label: 'Knowledge AI', icon: <Brain className="h-5 w-5" />, path: '/knowledge-ai' },
]

export default function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const currentUser = auth.getCurrentUser()

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Navigate to suppliers page with search query
    navigate(`/suppliers?search=${encodeURIComponent(query)}`)
  }

  const handleLogout = () => {
    auth.logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-primary-600">ARTPark</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path)
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <Link
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 max-w-2xl mx-4">
              <SearchBar
                placeholder="Search suppliers, labs, mentors..."
                onSearch={handleSearch}
              />
            </div>
            <div className="flex items-center gap-2">
              <Link to="/notifications">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>
              </Link>
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {currentUser?.name || 'User'}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

