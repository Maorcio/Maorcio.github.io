import { useRef, useEffect } from "react"
import { DirectionalLight, PointLight } from "three"
import { useFrame } from "@react-three/fiber"

interface AstreLightsProps {
  sunPosition: [number, number, number]
  moonPosition: [number, number, number]
  transition: number
}

export default function AstreLights({ sunPosition, moonPosition, transition }: AstreLightsProps) {
  const sunRef = useRef<DirectionalLight>(null)
  const moonRef = useRef<PointLight>(null)

  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.position.set(...sunPosition)
      sunRef.current.intensity = sunPosition[1] > 0 ? 2 * (1 - transition) : 0
    }
    if (moonRef.current) {
      moonRef.current.position.set(...moonPosition)
      moonRef.current.intensity = moonPosition[1] > 0 ? 2 * transition : 0
    }
  })

  return (
    <>
      <directionalLight
        ref={sunRef}
        position={sunPosition}
        intensity={2 * (1 - transition)}
        color="#fff8e1"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight
        ref={moonRef}
        position={moonPosition}
        intensity={2 * transition}
        color="#cce6ff"
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
    </>
  )
}
