import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, Mail } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import SearchBar from '@/components/ui/SearchBar'
import ListSkeleton from '@/components/ui/ListSkeleton'
import Button from '@/components/ui/Button'
import { mentorsApi, type Mentor } from '@/api/mockApi'

export default function MentorListPage() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadMentors()
  }, [searchQuery])

  const loadMentors = async () => {
    setIsLoading(true)
    try {
      let data: Mentor[]
      if (searchQuery) {
        data = await mentorsApi.search(searchQuery)
      } else {
        data = await mentorsApi.getAll()
      }
      setMentors(data)
    } catch (error) {
      console.error('Failed to load mentors:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mentors & Experts</h1>
        <p className="text-gray-600 mt-1">Connect with experienced mentors for guidance and support</p>
      </div>

      <div className="max-w-2xl">
        <SearchBar
          placeholder="Search mentors by name, expertise, or title..."
          onSearch={setSearchQuery}
        />
      </div>

      {isLoading ? (
        <ListSkeleton count={5} />
      ) : mentors.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <p className="text-gray-500">No mentors found. Try adjusting your search.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <Link key={mentor.id} to={`/mentors/${mentor.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-semibold text-primary-600">
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{mentor.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{mentor.title}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{mentor.rating}</span>
                        <span className="text-xs text-gray-500">({mentor.sessionsCompleted} sessions)</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{mentor.bio}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {mentor.expertise.slice(0, 3).map((exp, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs font-medium bg-orange-50 text-orange-700 rounded"
                      >
                        {exp}
                      </span>
                    ))}
                    {mentor.expertise.length > 3 && (
                      <span className="px-2 py-1 text-xs text-gray-500">
                        +{mentor.expertise.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className={`text-xs font-medium ${
                      mentor.availability === 'Available' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {mentor.availability}
                    </span>
                    <Button variant="ghost" size="sm">
                      View Profile →
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

