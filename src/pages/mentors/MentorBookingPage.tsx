import { useParams, useSearchParams, Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import DetailHeader from '@/components/ui/DetailHeader'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function MentorBookingPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const isSuccess = searchParams.get('success') === 'true'

  if (isSuccess) {
    return (
      <div className="space-y-6">
        <DetailHeader title="Session Booked" backUrl="/mentors" />
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Session Booked Successfully</h2>
            <p className="text-gray-600 mb-6">
              Your mentor session has been booked. You'll receive a confirmation email with meeting details.
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/mentors">
                <Button variant="outline">Back to Mentors</Button>
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
      <DetailHeader title="Book Mentor Session" backUrl={`/mentors/${id}`} />
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-gray-600 mb-6">
            Please use the booking widget on the mentor profile page to submit your request.
          </p>
          <Link to={`/mentors/${id}`}>
            <Button>Go to Mentor Profile</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

