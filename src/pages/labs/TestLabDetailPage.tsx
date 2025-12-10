import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Star, Mail, Phone, Calendar } from 'lucide-react'
import DetailHeader from '@/components/ui/DetailHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import BookingWidget from '@/components/ui/BookingWidget'
import { labsApi, bookingApi, type Lab } from '@/api/mockApi'
import ListSkeleton from '@/components/ui/ListSkeleton'

export default function TestLabDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [lab, setLab] = useState<Lab | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)

  useEffect(() => {
    if (id) {
      loadLab()
    }
  }, [id])

  const loadLab = async () => {
    setIsLoading(true)
    try {
      const data = await labsApi.getById(id!)
      setLab(data || null)
    } catch (error) {
      console.error('Failed to load lab:', error)
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
    if (!lab) return
    setIsBooking(true)
    try {
      await bookingApi.createLabBooking({
        labId: lab.id,
        date: data.date,
        duration: data.duration,
        purpose: data.purpose,
      })
      // Navigate to booking confirmation
      window.location.href = `/labs/${lab.id}/booking?success=true`
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

  if (!lab) {
    return (
      <div>
        <DetailHeader title="Lab not found" backUrl="/labs" />
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">The lab you're looking for doesn't exist.</p>
            <Link to="/labs">
              <Button className="mt-4">Back to Labs</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DetailHeader
        title={lab.name}
        subtitle={lab.location}
        backUrl="/labs"
        actions={
          <Link to={`/labs/${lab.id}/booking`}>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Book Now
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
              <p className="text-gray-600">{lab.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lab.testTypes.map((type, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm font-medium bg-green-50 text-green-700 rounded-lg"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Facilities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {lab.facilities.map((facility, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
                    {facility}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <a
                  href={`mailto:${lab.contact.email}`}
                  className="text-sm text-primary-600 hover:underline"
                >
                  {lab.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">{lab.contact.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">{lab.location}</span>
              </div>
            </CardContent>
          </Card>

          <BookingWidget
            onSubmit={handleBooking}
            isLoading={isBooking}
          />
        </div>
      </div>
    </div>
  )
}

