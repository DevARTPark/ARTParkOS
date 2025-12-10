import { useState, FormEvent } from 'react'
import { CheckCircle2 } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { rfqApi } from '@/api/mockApi'
import type { Supplier } from '@/api/mockApi'

interface RFQModalProps {
  supplier: Supplier
  isOpen: boolean
  onClose: () => void
}

export default function RFQModal({ supplier, isOpen, onClose }: RFQModalProps) {
  const [description, setDescription] = useState('')
  const [quantity, setQuantity] = useState('')
  const [deadline, setDeadline] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await rfqApi.create({
        supplierId: supplier.id,
        description,
        quantity: quantity ? parseInt(quantity) : undefined,
        deadline: deadline || undefined,
      })
      setIsSuccess(true)
      setTimeout(() => {
        onClose()
        setIsSuccess(false)
        setDescription('')
        setQuantity('')
        setDeadline('')
      }, 2000)
    } catch (error) {
      console.error('Failed to create RFQ:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="RFQ Submitted">
        <div className="text-center py-6">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Submitted Successfully</h3>
          <p className="text-gray-600">
            Your RFQ has been sent to {supplier.name}. You'll receive a response soon.
          </p>
        </div>
      </Modal>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Request Quote - ${supplier.name}`} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Describe what you need, specifications, requirements..."
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            label="Quantity (Optional)"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g., 100"
            min="1"
          />
          <Input
            type="date"
            label="Deadline (Optional)"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} className="flex-1">
            Submit RFQ
          </Button>
        </div>
      </form>
    </Modal>
  )
}

