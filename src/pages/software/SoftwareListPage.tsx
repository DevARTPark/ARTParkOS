import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import SearchBar from '@/components/ui/SearchBar'
import FilterBar, { Filter } from '@/components/ui/FilterBar'
import Select from '@/components/ui/Select'
import ListSkeleton from '@/components/ui/ListSkeleton'
import Button from '@/components/ui/Button'
import { softwareApi, type Software } from '@/api/mockApi'

export default function SoftwareListPage() {
  const [software, setSoftware] = useState<Software[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Filter[]>([])
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [licenseFilter, setLicenseFilter] = useState('all')

  useEffect(() => {
    loadSoftware()
  }, [searchQuery, categoryFilter, licenseFilter])

  const loadSoftware = async () => {
    setIsLoading(true)
    try {
      let data: Software[]
      if (searchQuery) {
        data = await softwareApi.search(searchQuery)
      } else {
        data = await softwareApi.getAll()
      }

      if (categoryFilter !== 'all') {
        data = data.filter(s => s.category === categoryFilter)
      }
      if (licenseFilter !== 'all') {
        data = data.filter(s => s.licenseType === licenseFilter)
      }

      setSoftware(data)
    } catch (error) {
      console.error('Failed to load software:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value)
    if (value !== 'all') {
      setFilters(prev => {
        const filtered = prev.filter(f => f.key !== 'category')
        return [...filtered, { key: 'category', label: 'Category', value }]
      })
    } else {
      setFilters(prev => prev.filter(f => f.key !== 'category'))
    }
  }

  const handleLicenseChange = (value: string) => {
    setLicenseFilter(value)
    if (value !== 'all') {
      setFilters(prev => {
        const filtered = prev.filter(f => f.key !== 'license')
        return [...filtered, { key: 'license', label: 'License Type', value }]
      })
    } else {
      setFilters(prev => prev.filter(f => f.key !== 'license'))
    }
  }

  const removeFilter = (key: string) => {
    if (key === 'category') setCategoryFilter('all')
    if (key === 'license') setLicenseFilter('all')
    setFilters(prev => prev.filter(f => f.key !== key))
  }

  const clearAllFilters = () => {
    setCategoryFilter('all')
    setLicenseFilter('all')
    setFilters([])
  }

  const categories = Array.from(new Set(software.map(s => s.category)))
  const licenseTypes = Array.from(new Set(software.map(s => s.licenseType)))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Software Licensing Portal</h1>
        <p className="text-gray-600 mt-1">Browse and request access to software tools and licenses</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search software by name, category, or description..."
            onSearch={handleSearch}
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={categoryFilter}
            onChange={(e) => handleCategoryChange(e.target.value)}
            options={[
              { value: 'all', label: 'All Categories' },
              ...categories.map(c => ({ value: c, label: c })),
            ]}
            className="w-48"
          />
          <Select
            value={licenseFilter}
            onChange={(e) => handleLicenseChange(e.target.value)}
            options={[
              { value: 'all', label: 'All License Types' },
              ...licenseTypes.map(l => ({ value: l, label: l })),
            ]}
            className="w-48"
          />
        </div>
      </div>

      {filters.length > 0 && (
        <FilterBar
          filters={filters}
          onRemoveFilter={removeFilter}
          onClearAll={clearAllFilters}
        />
      )}

      {isLoading ? (
        <ListSkeleton count={6} />
      ) : software.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <p className="text-gray-500">No software found. Try adjusting your search or filters.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {software.map((item) => (
            <Link key={item.id} to={`/software/${item.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <Package className="h-8 w-8 text-primary-500" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                      {item.licenseType}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      item.availability === 'Available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.availability}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.features.slice(0, 2).map((feature, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs font-medium bg-pink-50 text-pink-700 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {item.features.length > 2 && (
                      <span className="px-2 py-1 text-xs text-gray-500">
                        +{item.features.length - 2} more
                      </span>
                    )}
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <Button variant="ghost" size="sm" className="w-full">
                      View Details →
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

