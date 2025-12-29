import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { DirectionalLight, PointLight } from "three"

interface AstreAnimationProps {
  transition: number
}

export default function AstreAnimation({ transition }: AstreAnimationProps) {
  const sunRef = useRef<DirectionalLight>(null)
  const moonRef = useRef<PointLight>(null)

  useFrame(({ clock }) => {
    // Vitesse du cycle (ajustez pour ralentir/accélérer)
    const cycleSpeed = 0.05 // Plus petit = plus lent
    const time = clock.getElapsedTime() * cycleSpeed

    // Angle du soleil : 0 = lever, π/2 = midi, π = coucher, 3π/2 = minuit
    const sunAngle = time % (Math.PI * 2)

    // La lune est à l'opposé du soleil (décalage de π)
    const moonAngle = (sunAngle + Math.PI) % (Math.PI * 2)

    // Rayon de l'orbite
    const orbitRadius = 40
    const orbitHeight = 25

    // Position du soleil (arc de cercle dans le ciel)
    const sunX = Math.cos(sunAngle) * orbitRadius

    const sunY = Math.sin(sunAngle) * orbitHeight
    const sunZ = -20

    // Position de la lune (arc opposé)
    const moonX = Math.cos(moonAngle) * orbitRadius
    const moonY = Math.sin(moonAngle) * orbitHeight
    const moonZ = -20

    // Calcul de l'intensité basée sur la hauteur (0 si sous l'horizon)
    const sunIntensityFactor = Math.max(0, Math.sin(sunAngle))
    // La lune est toujours visible (chargée dès le début)
    const moonIntensityFactor = Math.max(0, Math.sin(moonAngle))

    if (sunRef.current) {
      sunRef.current.position.set(sunX, sunY, sunZ)
      // Intensité du soleil : forte en journée, nulle la nuit
      sunRef.current.intensity = sunIntensityFactor * 2.5 * (1 - transition)

      // Couleur qui change selon la hauteur (lever/coucher = orange)
      if (sunIntensityFactor > 0) {
        const sunsetFactor = 1 - Math.abs(sunY / orbitHeight)
        sunRef.current.color.setHex(
          sunsetFactor > 0.7 ? 0xffaa66 : 0xfff8e1
        )
      }
    }

    if (moonRef.current) {
      moonRef.current.position.set(moonX, moonY, moonZ)
      // Intensité de la lune : visible même si sous l'horizon (faible)
      moonRef.current.intensity = moonIntensityFactor * 1.8 * transition
      moonRef.current.distance = 60
      moonRef.current.decay = 2
    }
  })

  return (
    <>
      {/* Soleil */}
      <directionalLight
        ref={sunRef}
        position={[40, 25, -20]}
        intensity={2.5 * (1 - transition)}
        color="#fff8e1"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-camera-near={0.5}
        shadow-camera-far={100}
        shadow-bias={-0.0001}
      />
      
      {/* Lune */}
      <pointLight
        ref={moonRef}
        position={[-40, 25, -20]}
        intensity={1.8 * transition}
        color="#cce6ff"
        distance={60}
        decay={2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-bias={-0.0001}
      />
      
      {/* Lumière ambiante qui diminue la nuit */}
      <ambientLight 
        intensity={0.3 + 0.4 * (1 - transition)} 
        color={transition > 0.5 ? "#4466aa" : "#ffffff"} 
      />
      
      {/* Lumière d'appoint pour éviter le noir complet la nuit */}
      <hemisphereLight
        color="#7799cc"
        groundColor="#334455"
        intensity={0.2 * transition}
      />
    </>
  )
}
