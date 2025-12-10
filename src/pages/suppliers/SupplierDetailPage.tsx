import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Star, Mail, Phone, Globe, CheckCircle2, Scale } from 'lucide-react'
import DetailHeader from '@/components/ui/DetailHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import { suppliersApi, type Supplier } from '@/api/mockApi'
import ListSkeleton from '@/components/ui/ListSkeleton'
import RFQModal from '@/components/suppliers/RFQModal'

export default function SupplierDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showRFQModal, setShowRFQModal] = useState(false)

  useEffect(() => {
    if (id) {
      loadSupplier()
    }
  }, [id])

  const loadSupplier = async () => {
    setIsLoading(true)
    try {
      const data = await suppliersApi.getById(id!)
      setSupplier(data || null)
    } catch (error) {
      console.error('Failed to load supplier:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div>
        <DetailHeader title="Loading..." />
        <ListSkeleton count={3} itemHeight="h-32" />
      </div>
    )
  }

  if (!supplier) {
    return (
      <div>
        <DetailHeader title="Supplier not found" backUrl="/suppliers" />
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">The supplier you're looking for doesn't exist.</p>
            <Link to="/suppliers">
              <Button className="mt-4">Back to Suppliers</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DetailHeader
        title={supplier.name}
        subtitle={supplier.category}
        backUrl="/suppliers"
        actions={
          <div className="flex gap-2">
            <Link to="/suppliers/compare">
              <Button variant="outline">
                <Scale className="h-4 w-4 mr-2" />
                Compare
              </Button>
            </Link>
            <Button onClick={() => setShowRFQModal(true)}>
              Request Quote
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{supplier.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {supplier.capabilities.map((cap, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm font-medium bg-primary-50 text-primary-700 rounded-lg"
                  >
                    {cap}
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
                    <span className="text-lg font-semibold">{supplier.rating}</span>
                    <span className="text-sm text-gray-500">/ 5.0</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Projects Completed</p>
                  <p className="text-lg font-semibold">{supplier.projectsCompleted}</p>
                </div>
              </div>
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
                  href={`mailto:${supplier.contact.email}`}
                  className="text-sm text-primary-600 hover:underline"
                >
                  {supplier.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <a
                  href={`tel:${supplier.contact.phone}`}
                  className="text-sm text-gray-700"
                >
                  {supplier.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-400" />
                <a
                  href={supplier.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:underline"
                >
                  Visit Website
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">{supplier.location}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Button
                className="w-full"
                onClick={() => setShowRFQModal(true)}
              >
                Request Quote
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {showRFQModal && (
        <RFQModal
          supplier={supplier}
          isOpen={showRFQModal}
          onClose={() => setShowRFQModal(false)}
        />
      )}
    </div>
  )
}

