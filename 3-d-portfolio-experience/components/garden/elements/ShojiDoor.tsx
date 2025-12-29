import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RigidBody, RapierRigidBody } from "@react-three/rapier"
import * as THREE from "three"

type ShojiColors = {
    SHOJI_WOOD: string
    SHOJI_PAPER: string
    ORNAMENT: string
    WOOD_TRIM: string
}

type ShojiDoorProps = {
    open: boolean
    width: number
    height: number
    yBase?: number
    z?: number
    COLORS: ShojiColors
}

export function ShojiDoor({ 
  open, 
  width, 
  height, 
  yBase = 0, 
  z = 0, 
  COLORS
}: ShojiDoorProps) {
  const leftRef = useRef<THREE.Group>(null)
  const rightRef = useRef<THREE.Group>(null)
  const leftRigidBodyRef = useRef<RapierRigidBody>(null)
  const rightRigidBodyRef = useRef<RapierRigidBody>(null)

  const panelWidth = width / 2 - 0.02

  useFrame(() => {
    if (leftRef.current && rightRef.current) {
      const targetLeft = open ? -width / 1.5 : -width / 4
      const targetRight = open ? width / 1.5 : width / 4

      const speed = 0.08

      const deltaLeft = targetLeft - leftRef.current.position.x
      leftRef.current.position.x += deltaLeft * speed

      const deltaRight = targetRight - rightRef.current.position.x
      rightRef.current.position.x += deltaRight * speed

      // Ne jamais déplacer les RigidBody si la porte est ouverte ou si les refs sont invalides
      if (!open) {
        if (leftRigidBodyRef.current && leftRef.current.parent && leftRigidBodyRef.current.setTranslation) {
          const worldPos = new THREE.Vector3()
          leftRef.current.getWorldPosition(worldPos)
          try {
            leftRigidBodyRef.current.setTranslation(worldPos, true)
          } catch (e) {}
        }
        if (rightRigidBodyRef.current && rightRef.current.parent && rightRigidBodyRef.current.setTranslation) {
          const worldPos = new THREE.Vector3()
          rightRef.current.getWorldPosition(worldPos)
          try {
            rightRigidBodyRef.current.setTranslation(worldPos, true)
          } catch (e) {}
        }
      }
    }
  })

  const Panel = ({ xOffset, isLeft }: { xOffset: number; isLeft: boolean }) => {
    const zGrille = 0.07
    const zPoignee = 0.09
    const zBordure = 0.11
    
    return (
      <group>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[panelWidth, height, 0.08]} />
          <meshStandardMaterial color={COLORS.SHOJI_WOOD} roughness={0.75} />
        </mesh>
        
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[panelWidth - 0.08, height - 0.12, 0.02]} />
          <meshStandardMaterial 
            color={COLORS.SHOJI_PAPER} 
            transparent
            opacity={0.88}
            roughness={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={`h-${i}`} position={[0, -height / 2 + (i + 0.5) * (height / 6), zGrille]}>
            <boxGeometry args={[panelWidth - 0.12, 0.04, 0.02]} />
            <meshStandardMaterial color={COLORS.SHOJI_WOOD} roughness={0.8} />
          </mesh>
        ))}
        
        {Array.from({ length: 4 }, (_, i) => (
          <mesh key={`v-${i}`} position={[-(panelWidth / 2) + (i + 0.5) * (panelWidth / 4), 0, zGrille]}>
            <boxGeometry args={[0.04, height - 0.16, 0.02]} />
            <meshStandardMaterial color={COLORS.SHOJI_WOOD} roughness={0.8} />
          </mesh>
        ))}
        
        <mesh 
          position={[xOffset * (panelWidth / 3), 0, zPoignee]} 
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.09, 0.09, 0.04, 20]} />
          <meshStandardMaterial 
            color={COLORS.ORNAMENT} 
            metalness={0.85}
            roughness={0.18}
          />
        </mesh>
        
        <mesh position={[0, 0, zBordure]}>
          <boxGeometry args={[panelWidth - 0.04, height - 0.08, 0.01]} />
          <meshStandardMaterial 
            color={COLORS.SHOJI_WOOD} 
            roughness={0.85}
            transparent
            opacity={0.3}
          />
        </mesh>
      </group>
    )
  }

  return (
    <group position={[0, yBase + height / 2, z + 0.15]}>
      {/* Panneau gauche visuel */}
      <group ref={leftRef} position={[-width / 4, 0, 0]}>
        <Panel xOffset={1} isLeft={true} />
      </group>


      {/* Collider physique du panneau gauche : toujours présent, passe en sensor si porte ouverte */}
      <RigidBody 
        ref={leftRigidBodyRef}
        type="kinematicPosition" 
        position={[-width / 4, 0, 0]}
      >
        <mesh visible={false}>
          <boxGeometry args={[panelWidth, height, 0.15]} />
        </mesh>
        {/* Le collider devient sensor (non bloquant) si la porte est ouverte */}
        <mesh visible={false} userData={{ isSensor: open }}>
          <boxGeometry args={[panelWidth, height, 0.15]} />
        </mesh>
      </RigidBody>

      {/* Panneau droit visuel */}
      <group ref={rightRef} position={[width / 4, 0, 0]}>
        <Panel xOffset={-1} isLeft={false} />
      </group>


      {/* Collider physique du panneau droit : toujours présent, passe en sensor si porte ouverte */}
      <RigidBody 
        ref={rightRigidBodyRef}
        type="kinematicPosition" 
        position={[width / 4, 0, 0]}
      >
        <mesh visible={false}>
          <boxGeometry args={[panelWidth, height, 0.15]} />
        </mesh>
        {/* Le collider devient sensor (non bloquant) si la porte est ouverte */}
        <mesh visible={false} userData={{ isSensor: open }}>
          <boxGeometry args={[panelWidth, height, 0.15]} />
        </mesh>
      </RigidBody>

      {/* Rails */}
      <RigidBody type="fixed" colliders="cuboid">
        <group position={[0, -height / 2 - 0.08, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[width + 0.2, 0.12, 0.18]} />
            <meshStandardMaterial color={COLORS.WOOD_TRIM} roughness={0.92} />
          </mesh>
          <mesh position={[-width / 4, 0.04, 0]}>
            <boxGeometry args={[width / 2 + 0.05, 0.04, 0.1]} />
            <meshStandardMaterial color="#3a2a1a" roughness={0.95} />
          </mesh>
          <mesh position={[width / 4, 0.04, 0]}>
            <boxGeometry args={[width / 2 + 0.05, 0.04, 0.1]} />
            <meshStandardMaterial color="#3a2a1a" roughness={0.95} />
          </mesh>
        </group>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid">
        <group position={[0, height / 2 + 0.08, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[width + 0.2, 0.12, 0.18]} />
            <meshStandardMaterial color={COLORS.WOOD_TRIM} roughness={0.92} />
          </mesh>
          <mesh position={[0, -0.04, 0]}>
            <boxGeometry args={[width, 0.04, 0.1]} />
            <meshStandardMaterial color="#3a2a1a" roughness={0.95} />
          </mesh>
        </group>
      </RigidBody>
    </group>
  )
}
