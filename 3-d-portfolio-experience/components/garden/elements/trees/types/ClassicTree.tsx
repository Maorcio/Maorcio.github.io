import { ReactNode } from "react"
import { FOLIAGE_COLORS } from "../TreeTypes"

export const ClassicTree = {
  label: "Arbre classique",
  color: (rand: () => number) => FOLIAGE_COLORS[Math.floor(rand() * FOLIAGE_COLORS.length)],
  trunk: { radiusTop: 0.2, radiusBottom: 0.3, height: 3 },
  foliage: { radius: 1.5, y: 3.5 },
  render: (pos: [number, number, number], color: string, i: number, scale: number = 1): ReactNode => (
    <group key={"classic-"+i} position={pos} scale={[scale, scale, scale]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.2, 0.3, 3, 8]} />
        <meshStandardMaterial color="#4a3728" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.5, 0]} castShadow>
        <sphereGeometry args={[1.5, 12, 12]} />
        <meshStandardMaterial color={color} roughness={0.7} transparent opacity={0.9} />
      </mesh>
    </group>
  )
} as const;
