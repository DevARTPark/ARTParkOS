import { useState } from 'react'
import { Brain } from 'lucide-react'
import ChatWidget, { Message } from '@/components/ui/ChatWidget'
import { suppliersApi, labsApi, mentorsApi } from '@/api/mockApi'

export default function KnowledgeAIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m ARTPark Knowledge AI. I can help you find suppliers, test labs, facilities, and mentors. What are you looking for?',
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Simulate AI response with RAG-like behavior
    setTimeout(() => {
      const lowerContent = content.toLowerCase()
      let response = ''
      const links: Array<{ type: string; id: string; name: string }> = []

      // Simple keyword matching to demonstrate RAG functionality
      if (lowerContent.includes('supplier') || lowerContent.includes('component') || lowerContent.includes('hardware')) {
        response = 'I found several suppliers that might help you. Here are some relevant options:'
        // In real implementation, this would query the knowledge base
        suppliersApi.getAll().then(suppliers => {
          suppliers.slice(0, 3).forEach(s => {
            links.push({ type: 'suppliers', id: s.id, name: s.name })
          })
        })
      } else if (lowerContent.includes('lab') || lowerContent.includes('test') || lowerContent.includes('testing')) {
        response = 'I can help you find test labs. Here are some options:'
        labsApi.getAll().then(labs => {
          labs.slice(0, 2).forEach(l => {
            links.push({ type: 'labs', id: l.id, name: l.name })
          })
        })
      } else if (lowerContent.includes('mentor') || lowerContent.includes('expert') || lowerContent.includes('advice')) {
        response = 'I found some mentors who might be able to help you:'
        mentorsApi.getAll().then(mentors => {
          mentors.slice(0, 2).forEach(m => {
            links.push({ type: 'mentors', id: m.id, name: m.name })
          })
        })
      } else {
        response = 'I can help you find information about suppliers, test labs, facilities, and mentors. Could you be more specific about what you\'re looking for?'
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        links: links.length > 0 ? links : undefined,
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
            <Brain className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ARTPark Knowledge AI</h1>
            <p className="text-gray-600">Your intelligent assistant for finding resources</p>
          </div>
        </div>
      </div>

      <ChatWidget
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        placeholder="Ask about suppliers, labs, facilities, or mentors..."
      />
    </div>
  )
}

