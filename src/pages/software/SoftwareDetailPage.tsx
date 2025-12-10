import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Package, CheckCircle2 } from 'lucide-react'
import DetailHeader from '@/components/ui/DetailHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import { softwareApi, softwareRequestApi, type Software } from '@/api/mockApi'
import ListSkeleton from '@/components/ui/ListSkeleton'

export default function SoftwareDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [software, setSoftware] = useState<Software | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [purpose, setPurpose] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (id) {
      loadSoftware()
    }
  }, [id])

  const loadSoftware = async () => {
    setIsLoading(true)
    try {
      const data = await softwareApi.getById(id!)
      setSoftware(data || null)
    } catch (error) {
      console.error('Failed to load software:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!software) return
    setIsSubmitting(true)
    try {
      await softwareRequestApi.create({
        softwareId: software.id,
        purpose,
      })
      setIsSuccess(true)
      setTimeout(() => {
        setShowRequestModal(false)
        setIsSuccess(false)
        setPurpose('')
      }, 2000)
    } catch (error) {
      console.error('Failed to create request:', error)
    } finally {
      setIsSubmitting(false)
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

  if (!software) {
    return (
      <div>
        <DetailHeader title="Software not found" backUrl="/software" />
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">The software you're looking for doesn't exist.</p>
            <Link to="/software">
              <Button className="mt-4">Back to Software</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DetailHeader
        title={software.name}
        subtitle={software.category}
        backUrl="/software"
        actions={
          <Button onClick={() => setShowRequestModal(true)}>
            Request Access
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{software.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {software.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>License Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">License Type</p>
                <p className="text-sm font-medium text-gray-900">{software.licenseType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Availability</p>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded ${
                  software.availability === 'Available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {software.availability}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Button
                className="w-full"
                onClick={() => setShowRequestModal(true)}
                disabled={software.availability !== 'Available'}
              >
                Request Access
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {showRequestModal && (
        <Modal
          isOpen={showRequestModal}
          onClose={() => {
            if (!isSubmitting) {
              setShowRequestModal(false)
              setIsSuccess(false)
              setPurpose('')
            }
          }}
          title={`Request Access - ${software.name}`}
        >
          {isSuccess ? (
            <div className="text-center py-6">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Submitted</h3>
              <p className="text-gray-600">
                Your access request has been submitted. You'll be notified once it's approved.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose *
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="flex min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Describe how you plan to use this software..."
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowRequestModal(false)
                    setPurpose('')
                  }}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting} className="flex-1">
                  Submit Request
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  )
}

