// Simple mock auth utility
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'startup'
}

const STORAGE_KEY = 'artpark_user'

export const auth = {
  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  },

  setUser: (user: User) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY)
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEY)
  },
}

