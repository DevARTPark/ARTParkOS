import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import DetailHeader from '@/components/ui/DetailHeader'
import CompareTable from '@/components/ui/CompareTable'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { suppliersApi, type Supplier } from '@/api/mockApi'
import ListSkeleton from '@/components/ui/ListSkeleton'

export default function SupplierComparePage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSuppliers()
  }, [])

  useEffect(() => {
    if (suppliers.length > 0 && selectedIds.length > 0) {
      const selected = suppliers.filter(s => selectedIds.includes(s.id))
      setSelectedSuppliers(selected)
    } else {
      setSelectedSuppliers([])
    }
  }, [selectedIds, suppliers])

  const loadSuppliers = async () => {
    setIsLoading(true)
    try {
      const data = await suppliersApi.getAll()
      setSuppliers(data)
    } catch (error) {
      console.error('Failed to load suppliers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSupplier = (id: string) => {
    if (selectedIds.length < 3 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleRemoveSupplier = (id: string) => {
    setSelectedIds(selectedIds.filter(sid => sid !== id))
  }

  const compareRows = selectedSuppliers.length > 0 ? [
    { label: 'Name', values: selectedSuppliers.map(s => s.name) },
    { label: 'Category', values: selectedSuppliers.map(s => s.category) },
    { label: 'Location', values: selectedSuppliers.map(s => s.location) },
    { label: 'Rating', values: selectedSuppliers.map(s => `${s.rating} / 5.0`) },
    { label: 'Projects Completed', values: selectedSuppliers.map(s => s.projectsCompleted.toString()) },
    { label: 'Capabilities', values: selectedSuppliers.map(s => s.capabilities.join(', ')) },
    { label: 'Email', values: selectedSuppliers.map(s => s.contact.email) },
    { label: 'Phone', values: selectedSuppliers.map(s => s.contact.phone) },
  ] : []

  if (isLoading) {
    return (
      <div>
        <DetailHeader title="Compare Suppliers" backUrl="/suppliers" />
        <ListSkeleton count={3} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DetailHeader
        title="Compare Suppliers"
        subtitle="Select up to 3 suppliers to compare side-by-side"
        backUrl="/suppliers"
      />

      {selectedSuppliers.length === 0 ? (
        <Card>
          <div className="p-8">
            <h3 className="text-lg font-semibold mb-4">Select Suppliers to Compare</h3>
            <div className="space-y-3">
              {suppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">{supplier.name}</p>
                    <p className="text-sm text-gray-500">{supplier.category} • {supplier.location}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddSupplier(supplier.id)}
                    disabled={selectedIds.length >= 3 || selectedIds.includes(supplier.id)}
                  >
                    {selectedIds.includes(supplier.id) ? 'Selected' : 'Add'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ) : (
        <>
          <Card>
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {selectedSuppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    className="flex items-center gap-2 px-3 py-1 bg-primary-50 border border-primary-200 rounded-lg"
                  >
                    <span className="text-sm font-medium text-primary-900">{supplier.name}</span>
                    <button
                      onClick={() => handleRemoveSupplier(supplier.id)}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {selectedIds.length < 3 && (
                  <Select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) handleAddSupplier(e.target.value)
                    }}
                    options={[
                      { value: '', label: 'Add supplier...' },
                      ...suppliers
                        .filter(s => !selectedIds.includes(s.id))
                        .map(s => ({ value: s.id, label: s.name })),
                    ]}
                    className="w-48"
                  />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedIds([])}
                  className="ml-auto"
                >
                  Clear All
                </Button>
              </div>
            </div>
          </Card>

          <CompareTable
            rows={compareRows}
            headers={selectedSuppliers.map(s => s.name)}
          />

          <div className="flex gap-2">
            {selectedSuppliers.map((supplier) => (
              <Link key={supplier.id} to={`/suppliers/${supplier.id}`}>
                <Button variant="outline">
                  View {supplier.name} Details
                </Button>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

