import { ReactNode } from "react"
import { FOLIAGE_COLORS } from "../TreeTypes"

export const SakuraTree = {
  label: "Cerisier (Sakura)",
  color: (rand: () => number) => FOLIAGE_COLORS[12 + Math.floor(rand() * 3)],
  trunk: { radiusTop: 0.16, radiusBottom: 0.22, height: 2.7 },
  foliage: { radius: 1.6, y: 3.1 },
  render: (pos: [number, number, number], color: string, i: number, scale: number = 1): ReactNode => (
    <group key={"sakura-"+i} position={pos} scale={[scale, scale, scale]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.16, 0.22, 2.7, 10]} />
        <meshStandardMaterial color="#a97c50" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.1, 0]} castShadow>
        <sphereGeometry args={[1.6, 14, 14]} />
        <meshStandardMaterial color={color} roughness={0.6} transparent opacity={0.93} />
      </mesh>
    </group>
  )
} as const;
