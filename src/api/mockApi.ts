// Mock API functions with simulated latency
import suppliersData from '../data/suppliers.json'
import mentorsData from '../data/mentors.json'
import labsData from '../data/labs.json'
import equipmentData from '../data/equipment.json'
import softwareData from '../data/software.json'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Simulate API latency (300-800ms)
const simulateLatency = () => delay(300 + Math.random() * 500)

export interface Supplier {
  id: string
  name: string
  category: string
  description: string
  location: string
  capabilities: string[]
  contact: {
    email: string
    phone: string
    website: string
  }
  rating: number
  projectsCompleted: number
  image: string
}

export interface Mentor {
  id: string
  name: string
  title: string
  bio: string
  expertise: string[]
  availability: string
  sessionsCompleted: number
  rating: number
  image: string
  email: string
}

export interface Lab {
  id: string
  name: string
  location: string
  testTypes: string[]
  description: string
  facilities: string[]
  availability: string
  rating: number
  image: string
  contact: {
    email: string
    phone: string
  }
}

export interface Equipment {
  id: string
  name: string
  category: string
  description: string
  specifications: Record<string, string>
  location: string
  availability: string
  safetyNotes: string
  image: string
}

export interface Software {
  id: string
  name: string
  category: string
  description: string
  licenseType: string
  availability: string
  features: string[]
  image: string
}

// Suppliers API
export const suppliersApi = {
  getAll: async (): Promise<Supplier[]> => {
    await simulateLatency()
    return suppliersData as Supplier[]
  },

  getById: async (id: string): Promise<Supplier | undefined> => {
    await simulateLatency()
    return (suppliersData as Supplier[]).find(s => s.id === id)
  },

  search: async (query: string): Promise<Supplier[]> => {
    await simulateLatency()
    const lowerQuery = query.toLowerCase()
    return (suppliersData as Supplier[]).filter(s =>
      s.name.toLowerCase().includes(lowerQuery) ||
      s.category.toLowerCase().includes(lowerQuery) ||
      s.location.toLowerCase().includes(lowerQuery) ||
      s.capabilities.some(c => c.toLowerCase().includes(lowerQuery))
    )
  },
}

// Mentors API
export const mentorsApi = {
  getAll: async (): Promise<Mentor[]> => {
    await simulateLatency()
    return mentorsData as Mentor[]
  },

  getById: async (id: string): Promise<Mentor | undefined> => {
    await simulateLatency()
    return (mentorsData as Mentor[]).find(m => m.id === id)
  },

  search: async (query: string): Promise<Mentor[]> => {
    await simulateLatency()
    const lowerQuery = query.toLowerCase()
    return (mentorsData as Mentor[]).filter(m =>
      m.name.toLowerCase().includes(lowerQuery) ||
      m.title.toLowerCase().includes(lowerQuery) ||
      m.expertise.some(e => e.toLowerCase().includes(lowerQuery))
    )
  },
}

// Labs API
export const labsApi = {
  getAll: async (): Promise<Lab[]> => {
    await simulateLatency()
    return labsData as Lab[]
  },

  getById: async (id: string): Promise<Lab | undefined> => {
    await simulateLatency()
    return (labsData as Lab[]).find(l => l.id === id)
  },

  search: async (query: string): Promise<Lab[]> => {
    await simulateLatency()
    const lowerQuery = query.toLowerCase()
    return (labsData as Lab[]).filter(l =>
      l.name.toLowerCase().includes(lowerQuery) ||
      l.location.toLowerCase().includes(lowerQuery) ||
      l.testTypes.some(t => t.toLowerCase().includes(lowerQuery))
    )
  },
}

// Equipment API
export const equipmentApi = {
  getAll: async (): Promise<Equipment[]> => {
    await simulateLatency()
    return equipmentData as Equipment[]
  },

  getById: async (id: string): Promise<Equipment | undefined> => {
    await simulateLatency()
    return (equipmentData as Equipment[]).find(e => e.id === id)
  },

  search: async (query: string): Promise<Equipment[]> => {
    await simulateLatency()
    const lowerQuery = query.toLowerCase()
    return (equipmentData as Equipment[]).filter(e =>
      e.name.toLowerCase().includes(lowerQuery) ||
      e.category.toLowerCase().includes(lowerQuery) ||
      e.description.toLowerCase().includes(lowerQuery)
    )
  },
}

// Software API
export const softwareApi = {
  getAll: async (): Promise<Software[]> => {
    await simulateLatency()
    return softwareData as Software[]
  },

  getById: async (id: string): Promise<Software | undefined> => {
    await simulateLatency()
    return (softwareData as Software[]).find(s => s.id === id)
  },

  search: async (query: string): Promise<Software[]> => {
    await simulateLatency()
    const lowerQuery = query.toLowerCase()
    return (softwareData as Software[]).filter(s =>
      s.name.toLowerCase().includes(lowerQuery) ||
      s.category.toLowerCase().includes(lowerQuery) ||
      s.description.toLowerCase().includes(lowerQuery)
    )
  },
}

// Booking API (mock)
export const bookingApi = {
  createLabBooking: async (data: {
    labId: string
    date: string
    duration: number
    purpose: string
  }): Promise<{ id: string; status: string }> => {
    await simulateLatency()
    return {
      id: `booking-${Date.now()}`,
      status: 'pending',
    }
  },

  createFacilityBooking: async (data: {
    equipmentId: string
    date: string
    duration: number
    purpose: string
  }): Promise<{ id: string; status: string }> => {
    await simulateLatency()
    return {
      id: `booking-${Date.now()}`,
      status: 'pending',
    }
  },

  createMentorBooking: async (data: {
    mentorId: string
    date: string
    duration: number
    topic: string
  }): Promise<{ id: string; status: string }> => {
    await simulateLatency()
    return {
      id: `booking-${Date.now()}`,
      status: 'pending',
    }
  },
}

// RFQ API (mock)
export const rfqApi = {
  create: async (data: {
    supplierId: string
    description: string
    quantity?: number
    deadline?: string
  }): Promise<{ id: string; status: string }> => {
    await simulateLatency()
    return {
      id: `rfq-${Date.now()}`,
      status: 'pending',
    }
  },
}

// Software Request API (mock)
export const softwareRequestApi = {
  create: async (data: {
    softwareId: string
    purpose: string
    duration?: string
  }): Promise<{ id: string; status: string }> => {
    await simulateLatency()
    return {
      id: `request-${Date.now()}`,
      status: 'pending',
    }
  },

  getAll: async (): Promise<Array<{ id: string; softwareId: string; status: string; createdAt: string }>> => {
    await simulateLatency()
    return []
  },
}

