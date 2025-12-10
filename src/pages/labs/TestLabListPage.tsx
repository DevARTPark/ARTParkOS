import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Star, FlaskConical } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import SearchBar from '@/components/ui/SearchBar'
import FilterBar, { Filter } from '@/components/ui/FilterBar'
import Select from '@/components/ui/Select'
import ListSkeleton from '@/components/ui/ListSkeleton'
import Button from '@/components/ui/Button'
import { labsApi, type Lab } from '@/api/mockApi'

export default function TestLabListPage() {
  const [labs, setLabs] = useState<Lab[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Filter[]>([])
  const [testTypeFilter, setTestTypeFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')

  useEffect(() => {
    loadLabs()
  }, [searchQuery, testTypeFilter, locationFilter])

  const loadLabs = async () => {
    setIsLoading(true)
    try {
      let data: Lab[]
      if (searchQuery) {
        data = await labsApi.search(searchQuery)
      } else {
        data = await labsApi.getAll()
      }

      if (testTypeFilter !== 'all') {
        data = data.filter(l => l.testTypes.includes(testTypeFilter))
      }
      if (locationFilter !== 'all') {
        data = data.filter(l => l.location.includes(locationFilter))
      }

      setLabs(data)
    } catch (error) {
      console.error('Failed to load labs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleTestTypeChange = (value: string) => {
    setTestTypeFilter(value)
    if (value !== 'all') {
      setFilters(prev => {
        const filtered = prev.filter(f => f.key !== 'testType')
        return [...filtered, { key: 'testType', label: 'Test Type', value }]
      })
    } else {
      setFilters(prev => prev.filter(f => f.key !== 'testType'))
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
    if (key === 'testType') setTestTypeFilter('all')
    if (key === 'location') setLocationFilter('all')
    setFilters(prev => prev.filter(f => f.key !== key))
  }

  const clearAllFilters = () => {
    setTestTypeFilter('all')
    setLocationFilter('all')
    setFilters([])
  }

  const testTypes = Array.from(new Set(labs.flatMap(l => l.testTypes)))
  const locations = Array.from(new Set(labs.map(l => l.location)))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Test Lab Finder</h1>
        <p className="text-gray-600 mt-1">Find and book testing facilities for your products</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search labs by name, location, or test type..."
            onSearch={handleSearch}
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={testTypeFilter}
            onChange={(e) => handleTestTypeChange(e.target.value)}
            options={[
              { value: 'all', label: 'All Test Types' },
              ...testTypes.map(t => ({ value: t, label: t })),
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
        <ListSkeleton count={3} />
      ) : labs.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <p className="text-gray-500">No labs found. Try adjusting your search or filters.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {labs.map((lab) => (
            <Card key={lab.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{lab.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{lab.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{lab.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{lab.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {lab.testTypes.slice(0, 3).map((type, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs font-medium bg-green-50 text-green-700 rounded"
                    >
                      {type}
                    </span>
                  ))}
                  {lab.testTypes.length > 3 && (
                    <span className="px-2 py-1 text-xs text-gray-500">
                      +{lab.testTypes.length - 3} more
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className={`text-xs font-medium ${
                    lab.availability === 'Available' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {lab.availability}
                  </span>
                  <Link to={`/labs/${lab.id}`}>
                    <Button variant="ghost" size="sm">
                      View Details →
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

