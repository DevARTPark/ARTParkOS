import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MapPin, Star, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import SearchBar from '@/components/ui/SearchBar'
import FilterBar, { Filter } from '@/components/ui/FilterBar'
import Select from '@/components/ui/Select'
import ListSkeleton from '@/components/ui/ListSkeleton'
import { suppliersApi, type Supplier } from '@/api/mockApi'
import Button from '@/components/ui/Button'

export default function SupplierListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [filters, setFilters] = useState<Filter[]>([])
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')

  useEffect(() => {
    loadSuppliers()
  }, [searchQuery, categoryFilter, locationFilter])

  const loadSuppliers = async () => {
    setIsLoading(true)
    try {
      let data: Supplier[]
      if (searchQuery) {
        data = await suppliersApi.search(searchQuery)
      } else {
        data = await suppliersApi.getAll()
      }

      // Apply filters
      if (categoryFilter !== 'all') {
        data = data.filter(s => s.category === categoryFilter)
      }
      if (locationFilter !== 'all') {
        data = data.filter(s => s.location.includes(locationFilter))
      }

      setSuppliers(data)
    } catch (error) {
      console.error('Failed to load suppliers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setSearchParams({ search: query })
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

  const handleLocationChange = (value: string) => {
    setLocationFilter(value)
    if (value !== 'all') {
      setFilters(prev => {
        const filtered = prev.filter(f => f.key !== 'location')
        return [...filtered, { key: 'location', label: 'Location', value }]
      })
    } else {
      setFilters(prev => prev.filter(f => f.key !== 'location'))
    }
  }

  const removeFilter = (key: string) => {
    if (key === 'category') setCategoryFilter('all')
    if (key === 'location') setLocationFilter('all')
    setFilters(prev => prev.filter(f => f.key !== key))
  }

  const clearAllFilters = () => {
    setCategoryFilter('all')
    setLocationFilter('all')
    setFilters([])
  }

  const categories = Array.from(new Set(suppliers.map(s => s.category)))
  const locations = Array.from(new Set(suppliers.flatMap(s => s.location.split(',').map(l => l.trim()))))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Supplier Intelligence</h1>
        <p className="text-gray-600 mt-1">Find and compare suppliers for your robotics and AI needs</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search suppliers by name, category, location, or capability..."
            onSearch={handleSearch}
            initialValue={searchQuery}
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
            value={locationFilter}
            onChange={(e) => handleLocationChange(e.target.value)}
            options={[
              { value: 'all', label: 'All Locations' },
              ...locations.map(l => ({ value: l, label: l })),
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
        <ListSkeleton count={5} />
      ) : suppliers.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <p className="text-gray-500">No suppliers found. Try adjusting your search or filters.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier) => (
            <Link key={supplier.id} to={`/suppliers/${supplier.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{supplier.name}</h3>
                      <p className="text-sm text-gray-500">{supplier.category}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{supplier.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{supplier.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{supplier.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {supplier.capabilities.slice(0, 3).map((cap, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs font-medium bg-primary-50 text-primary-700 rounded"
                      >
                        {cap}
                      </span>
                    ))}
                    {supplier.capabilities.length > 3 && (
                      <span className="px-2 py-1 text-xs text-gray-500">
                        +{supplier.capabilities.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-xs text-gray-500">
                      {supplier.projectsCompleted} projects
                    </span>
                    <Button variant="ghost" size="sm">
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

