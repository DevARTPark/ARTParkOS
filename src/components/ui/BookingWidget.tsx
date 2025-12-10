import { useState, FormEvent } from 'react'
import { Calendar, Clock } from 'lucide-react'
import Button from './Button'
import Input from './Input'
import Select from './Select'
import { Card } from './Card'

export interface BookingWidgetProps {
  onSubmit: (data: {
    date: string
    duration: number
    purpose: string
    notes?: string
  }) => Promise<void>
  minDate?: string
  durationOptions?: Array<{ value: string; label: string }>
  isLoading?: boolean
}

export default function BookingWidget({
  onSubmit,
  minDate,
  durationOptions = [
    { value: '1', label: '1 hour' },
    { value: '2', label: '2 hours' },
    { value: '4', label: '4 hours' },
    { value: '8', label: 'Full day (8 hours)' },
  ],
  isLoading = false,
}: BookingWidgetProps) {
  const [date, setDate] = useState('')
  const [duration, setDuration] = useState('2')
  const [purpose, setPurpose] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await onSubmit({
      date,
      duration: parseInt(duration),
      purpose,
      notes: notes || undefined,
    })
    // Reset form on success
    setDate('')
    setDuration('2')
    setPurpose('')
    setNotes('')
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Book Now</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="inline h-4 w-4 mr-1" />
              Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={minDate || today}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Clock className="inline h-4 w-4 mr-1" />
              Duration
            </label>
            <Select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              options={durationOptions}
              required
            />
          </div>
          <Input
            label="Purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Brief description of what you need"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Any special requirements or notes..."
            />
          </div>
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Submit Booking Request
          </Button>
        </form>
      </div>
    </Card>
  )
}

