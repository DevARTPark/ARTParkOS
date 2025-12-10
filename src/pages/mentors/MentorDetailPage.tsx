import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, Mail, Calendar } from 'lucide-react'
import DetailHeader from '@/components/ui/DetailHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import BookingWidget from '@/components/ui/BookingWidget'
import { mentorsApi, bookingApi, type Mentor } from '@/api/mockApi'
import ListSkeleton from '@/components/ui/ListSkeleton'

export default function MentorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)

  useEffect(() => {
    if (id) {
      loadMentor()
    }
  }, [id])

  const loadMentor = async () => {
    setIsLoading(true)
    try {
      const data = await mentorsApi.getById(id!)
      setMentor(data || null)
    } catch (error) {
      console.error('Failed to load mentor:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBooking = async (data: {
    date: string
    duration: number
    purpose: string
    notes?: string
  }) => {
    if (!mentor) return
    setIsBooking(true)
    try {
      await bookingApi.createMentorBooking({
        mentorId: mentor.id,
        date: data.date,
        duration: data.duration,
        topic: data.purpose,
      })
      window.location.href = `/mentors/${mentor.id}/booking?success=true`
    } catch (error) {
      console.error('Failed to create booking:', error)
    } finally {
      setIsBooking(false)
    }
  }

  if (isLoading) {
    return (
      <div>
        <DetailHeader title="Loading..." />
        <ListSkeleton count={3} />
      </div>
    )
  }

  if (!mentor) {
    return (
      <div>
        <DetailHeader title="Mentor not found" backUrl="/mentors" />
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">The mentor you're looking for doesn't exist.</p>
            <Link to="/mentors">
              <Button className="mt-4">Back to Mentors</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DetailHeader
        title={mentor.name}
        subtitle={mentor.title}
        backUrl="/mentors"
        actions={
          <Link to={`/mentors/${mentor.id}/booking`}>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Book Session
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{mentor.bio}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Areas of Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mentor.expertise.map((exp, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm font-medium bg-orange-50 text-orange-700 rounded-lg"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-semibold">{mentor.rating}</span>
                    <span className="text-sm text-gray-500">/ 5.0</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Sessions Completed</p>
                  <p className="text-lg font-semibold">{mentor.sessionsCompleted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <a
                  href={`mailto:${mentor.email}`}
                  className="text-sm text-primary-600 hover:underline"
                >
                  {mentor.email}
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded ${
                mentor.availability === 'Available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {mentor.availability}
              </span>
            </CardContent>
          </Card>

          <BookingWidget
            onSubmit={handleBooking}
            isLoading={isBooking}
            durationOptions={[
              { value: '1', label: '1 hour' },
              { value: '2', label: '2 hours' },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

