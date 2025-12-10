import { Bell, CheckCircle2, Clock, XCircle, Info } from 'lucide-react'
import DetailHeader from '@/components/ui/DetailHeader'
import { Card, CardContent } from '@/components/ui/Card'

interface Notification {
  id: string
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  message: string
  timestamp: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Booking Confirmed',
    message: 'Your test lab booking for ARTPark Robotics Test Lab has been confirmed.',
    timestamp: '2024-01-15T10:30:00',
    read: false,
  },
  {
    id: '2',
    type: 'info',
    title: 'RFQ Response Received',
    message: 'RoboTech Solutions has responded to your RFQ.',
    timestamp: '2024-01-14T14:20:00',
    read: false,
  },
  {
    id: '3',
    type: 'success',
    title: 'Software Access Approved',
    message: 'Your request for ROS 2 Enterprise has been approved.',
    timestamp: '2024-01-13T09:15:00',
    read: true,
  },
  {
    id: '4',
    type: 'warning',
    title: 'Booking Reminder',
    message: 'You have a mentor session with Dr. Priya Sharma tomorrow at 2 PM.',
    timestamp: '2024-01-12T16:45:00',
    read: true,
  },
]

export default function NotificationsPage() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'warning':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div className="space-y-6">
      <DetailHeader title="Notifications" />

      {mockNotifications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No notifications</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {mockNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={notification.read ? 'opacity-75' : 'border-primary-200'}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {getIcon(notification.type)}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{notification.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

