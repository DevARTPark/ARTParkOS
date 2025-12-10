import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, AlertTriangle, Calendar } from 'lucide-react'
import DetailHeader from '@/components/ui/DetailHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import BookingWidget from '@/components/ui/BookingWidget'
import { equipmentApi, bookingApi, type Equipment } from '@/api/mockApi'
import ListSkeleton from '@/components/ui/ListSkeleton'

export default function FacilityDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)

  useEffect(() => {
    if (id) {
      loadEquipment()
    }
  }, [id])

  const loadEquipment = async () => {
    setIsLoading(true)
    try {
      const data = await equipmentApi.getById(id!)
      setEquipment(data || null)
    } catch (error) {
      console.error('Failed to load equipment:', error)
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
    if (!equipment) return
    setIsBooking(true)
    try {
      await bookingApi.createFacilityBooking({
        equipmentId: equipment.id,
        date: data.date,
        duration: data.duration,
        purpose: data.purpose,
      })
      window.location.href = `/facilities/${equipment.id}/booking?success=true`
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

  if (!equipment) {
    return (
      <div>
        <DetailHeader title="Equipment not found" backUrl="/facilities" />
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">The equipment you're looking for doesn't exist.</p>
            <Link to="/facilities">
              <Button className="mt-4">Back to Facilities</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DetailHeader
        title={equipment.name}
        subtitle={equipment.category}
        backUrl="/facilities"
        actions={
          <Link to={`/facilities/${equipment.id}/booking`}>
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
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{equipment.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                {Object.entries(equipment.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-700">{key}:</dt>
                    <dd className="text-sm text-gray-600">{value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          {equipment.safetyNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Safety Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">{equipment.safetyNotes}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">{equipment.location}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded ${
                equipment.availability === 'Available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {equipment.availability}
              </span>
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

