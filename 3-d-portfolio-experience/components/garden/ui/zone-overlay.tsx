"use client"

import { useZoneDetection } from "@/hooks/use-zone-detection"
import { getZoneByName } from "@/lib/zones"
import { useEffect, useState } from "react"

export function ZoneOverlay() {
  const currentZone = useZoneDetection()
  const [visible, setVisible] = useState(false)
  const zoneConfig = currentZone ? getZoneByName(currentZone) : null

  useEffect(() => {
    if (currentZone) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [currentZone])

  if (!visible || !zoneConfig) return null

  return (
    <div className="fixed inset-0 pointer-events-none flex items-start justify-center pt-8 z-50">
      <div
        className="pointer-events-auto bg-card/95 backdrop-blur-sm border-2 border-primary rounded-xl p-6 max-w-md shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500"
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(255, 183, 197, 0.1) 0%, rgba(255, 201, 212, 0.05) 100%)",
        }}
      >
        <div className="relative">
          {/* Decorative corner elements */}
          <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
          <div className="absolute -top-3 -right-3 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
          <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
          <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />

          <h2 className="text-2xl font-bold text-foreground mb-3 text-center text-balance">{zoneConfig.title}</h2>

          <p className="text-muted-foreground leading-relaxed text-center text-pretty">{zoneConfig.description}</p>

          {/* Subtle divider */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-px bg-primary/30 flex-1" />
            <div className="w-2 h-2 bg-primary/50 rounded-full" />
            <div className="h-px bg-primary/30 flex-1" />
          </div>
        </div>
      </div>
    </div>
  )
}
