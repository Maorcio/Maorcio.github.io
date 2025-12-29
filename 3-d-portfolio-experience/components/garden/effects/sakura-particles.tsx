"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function SakuraParticles() {
  const particlesRef = useRef<THREE.Points>(null)

  const particles = useMemo(() => {
    const count = 200
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60
      positions[i * 3 + 1] = Math.random() * 20 + 5
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60

      velocities[i * 3] = (Math.random() - 0.5) * 0.5
      velocities[i * 3 + 1] = -Math.random() * 0.3 - 0.1
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5
    }

    return { positions, velocities }
  }, [])

  useFrame((state, delta) => {
    if (!particlesRef.current) return

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += particles.velocities[i] * delta
      positions[i + 1] += particles.velocities[i + 1] * delta
      positions[i + 2] += particles.velocities[i + 2] * delta

      // Reset particle when it goes below ground
      if (positions[i + 1] < 0) {
        positions[i] = (Math.random() - 0.5) * 60
        positions[i + 1] = 20
        positions[i + 2] = (Math.random() - 0.5) * 60
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true
    particlesRef.current.rotation.y += delta * 0.05
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#ffb7c5"
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
