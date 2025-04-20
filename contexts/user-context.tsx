"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { createContext, useContext, useState } from "react"

type User = {
  name: string
  email: string
  specialty: string
  bio: string
}

type UserContextType = {
  user: User | null
  updateUser: (userData: Partial<User>) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Mock user data
const mockUser: User = {
  name: "Dr. Samir kchok",
  email: "sarah.johnson@example.com",
  specialty: "Family Medicine",
  bio: "Board-certified family physician with over 10 years of experience in primary care. Special interests include preventive medicine and chronic disease management.",
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(mockUser)

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null))
  }

  const logout = () => {
    setUser(null)
    router.push("/")
  }

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
