import { ReactNode } from "react"

export const PineTree = {
  label: "Pin",
  color: () => "#4b6f44",
  trunk: { radiusTop: 0.13, radiusBottom: 0.22, height: 4 },
  foliage: { radius: 0.9, y: 4.5 },
  render: (pos: [number, number, number], color: string, i: number, scale: number = 1): ReactNode => (
    <group key={"pine-"+i} position={pos} scale={[scale, scale, scale]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.13, 0.22, 4, 8]} />
        <meshStandardMaterial color="#3e5c23" roughness={0.8} />
      </mesh>
      <mesh position={[0, 4.5, 0]} castShadow>
        <coneGeometry args={[0.9, 2, 10]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
    </group>
  )
} as const;
