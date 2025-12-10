import { Link } from 'react-router-dom'
import { Store, FlaskConical, Building2, Users, Package, Brain, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { suppliersApi } from '@/api/mockApi'
import { useEffect, useState } from 'react'
import ListSkeleton from '@/components/ui/ListSkeleton'

export default function DashboardPage() {
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [recentRFQs, setRecentRFQs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setRecentBookings([
        { id: '1', type: 'Lab', name: 'ARTPark Robotics Test Lab', date: '2024-01-15' },
        { id: '2', type: 'Facility', name: '3D Printer - Ultimaker S5', date: '2024-01-16' },
        { id: '3', type: 'Mentor', name: 'Dr. Priya Sharma', date: '2024-01-17' },
      ])
      setRecentRFQs([
        { id: '1', supplier: 'RoboTech Solutions', status: 'pending', date: '2024-01-10' },
        { id: '2', supplier: 'AI Hardware Pro', status: 'approved', date: '2024-01-08' },
      ])
      setIsLoading(false)
    }, 500)
  }, [])

  const quickActions = [
    { label: 'Find Suppliers', icon: <Store className="h-5 w-5" />, path: '/suppliers', color: 'bg-blue-100 text-blue-600' },
    { label: 'Book Test Lab', icon: <FlaskConical className="h-5 w-5" />, path: '/labs', color: 'bg-green-100 text-green-600' },
    { label: 'Reserve Facility', icon: <Building2 className="h-5 w-5" />, path: '/facilities', color: 'bg-purple-100 text-purple-600' },
    { label: 'Find Mentor', icon: <Users className="h-5 w-5" />, path: '/mentors', color: 'bg-orange-100 text-orange-600' },
    { label: 'Software Access', icon: <Package className="h-5 w-5" />, path: '/software', color: 'bg-pink-100 text-pink-600' },
    { label: 'Knowledge AI', icon: <Brain className="h-5 w-5" />, path: '/knowledge-ai', color: 'bg-indigo-100 text-indigo-600' },
  ]

  const stats = [
    { label: 'Active Suppliers', value: '5', change: '+2 this month' },
    { label: 'Test Labs', value: '3', change: 'All available' },
    { label: 'Facilities', value: '5', change: '4 available' },
    { label: 'Mentors', value: '5', change: '4 available' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action) => (
            <Link key={action.path} to={action.path}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex p-3 rounded-lg mb-3 ${action.color}`}>
                    {action.icon}
                  </div>
                  <p className="text-sm font-medium text-gray-900">{action.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Bookings</CardTitle>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  View all <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ListSkeleton count={3} itemHeight="h-16" />
            ) : recentBookings.length === 0 ? (
              <p className="text-sm text-gray-500">No recent bookings</p>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{booking.name}</p>
                      <p className="text-xs text-gray-500">{booking.type} • {booking.date}</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent RFQs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent RFQs</CardTitle>
              <Link to="/suppliers">
                <Button variant="ghost" size="sm">
                  View all <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ListSkeleton count={2} itemHeight="h-16" />
            ) : recentRFQs.length === 0 ? (
              <p className="text-sm text-gray-500">No recent RFQs</p>
            ) : (
              <div className="space-y-3">
                {recentRFQs.map((rfq) => (
                  <div key={rfq.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{rfq.supplier}</p>
                      <p className="text-xs text-gray-500">{rfq.date}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      rfq.status === 'approved' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {rfq.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

