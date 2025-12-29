import { RigidBody } from "@react-three/rapier"
import * as THREE from "three"

// Muraille style japonais Edo (bois et pierre, tuiles, angles)
export function EdoWall({
  length = 100,
  height = 5,
  thickness = 1,
  position = [0, height / 2, 0],
  rotation = [0, 0, 0],
}: {
  length?: number
  height?: number
  thickness?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      {/* Base en pierre */}
      <mesh position={[0, -height / 2 + 1, 0]} rotation={rotation} castShadow receiveShadow>
        <boxGeometry args={[length, 2, thickness]} />
        <meshStandardMaterial color="#b0a489" roughness={0.8} />
      </mesh>
      {/* Partie supérieure en bois blanc */}
      <mesh position={[0, 1, 0]} rotation={rotation} castShadow receiveShadow>
        <boxGeometry args={[length, height - 2, thickness * 0.8]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.5} />
      </mesh>
      {/* Toit de muraille (tuiles noires) */}
      <mesh position={[0, height / 2, 0]} rotation={rotation} castShadow receiveShadow>
        <boxGeometry args={[length + 0.5, 0.5, thickness * 1.2]} />
        <meshStandardMaterial color="#222" roughness={0.3} metalness={0.2} />
      </mesh>
    </RigidBody>
  )
}
