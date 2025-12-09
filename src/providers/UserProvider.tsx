'use client'

import { api } from '@/functions/api'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type User = {
  id: string | null
  name: string | null
  email: string | null
  image: string | null
} | null

type UserContextValue = {
  user: User
  loading: boolean
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // inside UserProvider
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get<{ user: User }>('/api/me') // assuming api is axios wrapper
      setUser(response?.user ?? null)
    } catch (error: any) {
      const status = error?.response?.status
      if (status === 401) {
        // unauthenticated — set null but DO NOT redirect (prevents loop)
        setUser(null)
      } else {
        setUser(null) // fallback for other errors
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const value = useMemo(() => ({ user, loading, refreshUser: fetchUser }), [user, loading, fetchUser])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within a UserProvider')
  return ctx
}
