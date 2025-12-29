import * as THREE from 'three'
import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

// Toit stylisé "fait maison" (géométrie simple)
export function Roof(props: any) {
  const mesh = useRef<THREE.Mesh>(null)

  // Animation légère (optionnel)
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.001
    }
  })

  return (
    <group {...props}>
      {/* Corps du toit */}
      <mesh ref={mesh} position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[3, 6, 1, 4, 1, true]} />
        <meshStandardMaterial color="#a0522d" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Crête du toit */}
      <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI/4]}>
        <boxGeometry args={[6.2, 0.2, 0.4]} />
        <meshStandardMaterial color="#7c3f00" />
      </mesh>
      {/* Décorations latérales */}
      <mesh position={[-3, 0.3, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#c2b280" />
      </mesh>
      <mesh position={[3, 0.3, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#c2b280" />
      </mesh>
    </group>
  )
}
