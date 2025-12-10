import { useState, FormEvent } from 'react'
import { Search } from 'lucide-react'
import Input from './Input'

export interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
  initialValue?: string
}

export default function SearchBar({
  placeholder = 'Search...',
  onSearch,
  initialValue = '',
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>
    </form>
  )
}

