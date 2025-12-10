import { useState, useEffect } from 'react'
import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import DetailHeader from '@/components/ui/DetailHeader'
import { Card, CardContent } from '@/components/ui/Card'
import { softwareRequestApi } from '@/api/mockApi'
import ListSkeleton from '@/components/ui/ListSkeleton'

interface Request {
  id: string
  softwareId: string
  softwareName?: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export default function SoftwareRequestStatusPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    setIsLoading(true)
    try {
      const data = await softwareRequestApi.getAll()
      setRequests(data as Request[])
    } catch (error) {
      console.error('Failed to load requests:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-yellow-100 text-yellow-700'
    }
  }

  return (
    <div className="space-y-6">
      <DetailHeader
        title="Software Access Requests"
        subtitle="Track the status of your software access requests"
        backUrl="/software"
      />

      {isLoading ? (
        <ListSkeleton count={5} />
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No access requests yet.</p>
            <p className="text-sm text-gray-400 mt-2">
              Request access to software from the software list page.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(request.status)}
                    <div>
                      <p className="font-medium text-gray-900">
                        {request.softwareName || `Software ${request.softwareId}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        Requested on {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded ${getStatusColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

