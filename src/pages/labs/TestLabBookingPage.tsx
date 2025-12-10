import { useParams, useSearchParams, Link } from 'react-router-dom'
import { CheckCircle2, Calendar, Clock } from 'lucide-react'
import DetailHeader from '@/components/ui/DetailHeader'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function TestLabBookingPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const isSuccess = searchParams.get('success') === 'true'

  if (isSuccess) {
    return (
      <div className="space-y-6">
        <DetailHeader title="Booking Request Submitted" backUrl="/labs" />
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Booking Request Submitted</h2>
            <p className="text-gray-600 mb-6">
              Your booking request has been submitted successfully. You'll receive a confirmation email shortly.
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/labs">
                <Button variant="outline">Back to Labs</Button>
              </Link>
              <Link to="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DetailHeader title="Book Test Lab" backUrl={`/labs/${id}`} />
      <Card>
        <CardContent className="p-12 text-center">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Booking Calendar</h2>
          <p className="text-gray-600 mb-6">
            Please use the booking widget on the lab detail page to submit your request.
          </p>
          <Link to={`/labs/${id}`}>
            <Button>Go to Lab Details</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

