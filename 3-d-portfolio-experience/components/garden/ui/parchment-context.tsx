"use client"
import { createContext, useContext, useState, ReactNode } from "react"

export type ParchmentState = {
  zone: string | null
  projectId?: string | null
}

export type ParchmentContextType = {
  parchment: ParchmentState
  openParchment: (zone: string, projectId?: string) => void
  closeParchment: () => void
}

const ParchmentContext = createContext<ParchmentContextType | undefined>(undefined)

export function ParchmentProvider({ children }: { children: ReactNode }) {
  const [parchment, setParchment] = useState<ParchmentState>({ zone: null, projectId: null })

  const openParchment = (zone: string, projectId?: string) => {
    setParchment({ zone, projectId: projectId ?? null })
  }
  const closeParchment = () => {
    setParchment({ zone: null, projectId: null })
  }

  return (
    <ParchmentContext.Provider value={{ parchment, openParchment, closeParchment }}>
      {children}
    </ParchmentContext.Provider>
  )
}

export function useParchment() {
  const ctx = useContext(ParchmentContext)
  if (!ctx) throw new Error("useParchment must be used within a ParchmentProvider")
  return ctx
}
