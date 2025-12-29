"use client"

import { useState, useEffect } from "react"
import { useThree } from "@react-three/fiber"
import { getCurrentZone, type Zone } from "@/lib/zones"

export function useZoneDetection() {
  const { camera } = useThree()
  const [currentZone, setCurrentZone] = useState<Zone | null>(null)

  useEffect(() => {
    const checkZone = () => {
      const position: [number, number, number] = [camera.position.x, camera.position.y, camera.position.z]
      const zone = getCurrentZone(position)
      if (zone !== currentZone) {
        setCurrentZone(zone)
      }
    }

    const interval = setInterval(checkZone, 200)
    return () => clearInterval(interval)
  }, [camera, currentZone])

  return currentZone
}
