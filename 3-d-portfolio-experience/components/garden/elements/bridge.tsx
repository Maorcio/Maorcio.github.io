"use client"

import { useRouter } from "next/navigation"
import { useState, useMemo } from "react"
import { CatmullRomCurve3, Vector3, TubeGeometry, BufferGeometry, Float32BufferAttribute } from "three"
import { RigidBody } from "@react-three/rapier"

// Configuration du pont japonais
const BRIDGE_CONFIG = {
  DECK: {
    WIDTH: 2,
    CURVE_HEIGHT: 1.2,
    SEGMENTS: 40,
    BEAM_RADIUS: 0.08, // Rayon des poutres latérales (plus petit)
    COLOR: "#8B6F47",
    HOVER_COLOR: "#d4a574",
    ROUGHNESS: 0.8,
    BASE_HEIGHT: 0.5,
  },
  RAILS: {
    HEIGHT: 0.8,
    THICKNESS: 0.08,
    COLOR: "#6B4423",
    POSTS_COUNT: 8,
    POST_RADIUS: 0.06,
  },
  SUPPORTS: {
    COUNT: 3,
    RADIUS: 0.1,
    COLOR: "#5a4a3a",
  },
  POSITION: [0, 1.5, 13] as [number, number, number],
  LENGTH: 8,
} as const

// Génère une courbe en arc pour le pont
function createBridgeCurve(length: number, curveHeight: number, segments: number, baseHeight: number): CatmullRomCurve3 {
  const points: Vector3[] = []
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const x = (t - 0.5) * length
    const y = baseHeight + curveHeight * 1.25 * (1 - Math.pow(2 * t - 1, 2))
    const z = 0
    points.push(new Vector3(x, y, z))
  }
  
  return new CatmullRomCurve3(points)
}

// Sol incurvé marchable qui suit la courbe
function CurvedDeckSurface({ curve, hovered }: { curve: CatmullRomCurve3; hovered: boolean }) {
  const geometry = useMemo(() => {
    const segments = BRIDGE_CONFIG.DECK.SEGMENTS
    const width = BRIDGE_CONFIG.DECK.WIDTH
    const points = curve.getPoints(segments)
    
    const vertices: number[] = []
    const indices: number[] = []
    const uvs: number[] = []
    
    for (let i = 0; i <= segments; i++) {
      const point = points[i]
      const t = i / segments
      
      const tangent = curve.getTangentAt(t)
      const normal = new Vector3(-tangent.y, tangent.x, 0).normalize()
      
      const leftPoint = point.clone().add(normal.clone().multiplyScalar(-width / 2))
      const rightPoint = point.clone().add(normal.clone().multiplyScalar(width / 2))
      
      vertices.push(leftPoint.x, leftPoint.y, leftPoint.z)
      vertices.push(rightPoint.x, rightPoint.y, rightPoint.z)
      
      uvs.push(0, t)
      uvs.push(1, t)
    }
    
    for (let i = 0; i < segments; i++) {
      const base = i * 2
      indices.push(base, base + 1, base + 2)
      indices.push(base + 1, base + 3, base + 2)
    }
    
    const geo = new BufferGeometry()
    geo.setAttribute('position', new Float32BufferAttribute(vertices, 3))
    geo.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
    geo.setIndex(indices)
    geo.computeVertexNormals()
    
    return geo
  }, [curve])
  
  return (
    <RigidBody type="fixed" colliders="trimesh" gravityScale={0}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={hovered ? BRIDGE_CONFIG.DECK.HOVER_COLOR : BRIDGE_CONFIG.DECK.COLOR}
          roughness={BRIDGE_CONFIG.DECK.ROUGHNESS}
          side={2}
        />
      </mesh>
    </RigidBody>
  )
}

// Planches transversales décoratives
function DeckPlanks({ curve }: { curve: CatmullRomCurve3 }) {
  const planks = useMemo(() => {
    const plankCount = 25
    const results = []
    
    for (let i = 0; i < plankCount; i++) {
      const t = i / (plankCount - 1)
      const point = curve.getPointAt(t)
      const tangent = curve.getTangentAt(t)
      const angle = Math.atan2(tangent.y, tangent.x)
      
      results.push({
        position: [point.x, point.y + 0.02, point.z] as [number, number, number],
        rotation: [0, 0, angle] as [number, number, number],
      })
    }
    
    return results
  }, [curve])
  
  return (
    <>
      {planks.map((plank, i) => (
        <mesh
          key={i}
          position={plank.position}
          rotation={plank.rotation}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.12, 0.04, BRIDGE_CONFIG.DECK.WIDTH + 0.05]} />
          <meshStandardMaterial color="#6B5442" roughness={0.9} />
        </mesh>
      ))}
    </>
  )
}

// Poutres latérales structurelles (TAILLE CORRIGÉE)
function SideBeams({ curve, hovered }: { curve: CatmullRomCurve3; hovered: boolean }) {
  const beamGeometry = useMemo(() => {
    return new TubeGeometry(
      curve, 
      BRIDGE_CONFIG.DECK.SEGMENTS, 
      BRIDGE_CONFIG.DECK.BEAM_RADIUS, // Rayon réduit
      8, 
      false
    )
  }, [curve])

  return (
    <>
      {/* Poutre gauche - sous le bord gauche du tablier */}
      <mesh 
        position={[0, -0.08, -BRIDGE_CONFIG.DECK.WIDTH / 2 + 0.05]} 
        geometry={beamGeometry} 
        castShadow 
        receiveShadow
      >
        <meshStandardMaterial
          color="#5a4a3a"
          roughness={0.85}
        />
      </mesh>

      {/* Poutre droite - sous le bord droit du tablier */}
      <mesh 
        position={[0, -0.08, BRIDGE_CONFIG.DECK.WIDTH / 2 - 0.05]} 
        geometry={beamGeometry} 
        castShadow 
        receiveShadow
      >
        <meshStandardMaterial
          color="#5a4a3a"
          roughness={0.85}
        />
      </mesh>
      
      {/* Poutre centrale pour renforcement */}
      <mesh 
        position={[0, -0.15, 0]} 
        geometry={beamGeometry} 
        castShadow 
        receiveShadow
      >
        <meshStandardMaterial
          color="#5a4a3a"
          roughness={0.85}
        />
      </mesh>
    </>
  )
}

// Poteau de rambarde
function RailPost({ position, height }: { position: [number, number, number]; height: number }) {
  return (
    <mesh position={position} castShadow>
      <cylinderGeometry args={[BRIDGE_CONFIG.RAILS.POST_RADIUS, BRIDGE_CONFIG.RAILS.POST_RADIUS, height, 8]} />
      <meshStandardMaterial color={BRIDGE_CONFIG.RAILS.COLOR} roughness={0.9} />
    </mesh>
  )
}

// Rambarde
function BridgeRail({ side, curve }: { side: "left" | "right"; curve: CatmullRomCurve3 }) {
  const points = curve.getPoints(BRIDGE_CONFIG.RAILS.POSTS_COUNT)
  const zOffset = side === "left" ? -BRIDGE_CONFIG.DECK.WIDTH / 2 : BRIDGE_CONFIG.DECK.WIDTH / 2

  // Créer une courbe décalée pour le rail
  const railCurve = useMemo(() => {
    const railPoints = points.map(p => new Vector3(p.x, p.y + BRIDGE_CONFIG.RAILS.HEIGHT, zOffset))
    return new CatmullRomCurve3(railPoints)
  }, [points, zOffset])

  const railGeometry = useMemo(() => {
    return new TubeGeometry(railCurve, BRIDGE_CONFIG.DECK.SEGMENTS, BRIDGE_CONFIG.RAILS.THICKNESS * 0.5, 8, false)
  }, [railCurve])

  return (
    <group>
      {/* Poteaux verticaux */}
      {points.map((point, i) => (
        <RailPost
          key={i}
          position={[point.x, point.y + BRIDGE_CONFIG.RAILS.HEIGHT / 2, zOffset]}
          height={BRIDGE_CONFIG.RAILS.HEIGHT}
        />
      ))}

      {/* Rail horizontal supérieur */}
      <mesh geometry={railGeometry} castShadow>
        <meshStandardMaterial color={BRIDGE_CONFIG.RAILS.COLOR} roughness={0.9} />
      </mesh>
    </group>
  )
}

// Poutres de support sous le pont
function SupportBeams({ curve }: { curve: CatmullRomCurve3 }) {
  const supports = useMemo(() => {
    const results = []
    for (let i = 0; i < BRIDGE_CONFIG.SUPPORTS.COUNT; i++) {
      const t = i / (BRIDGE_CONFIG.SUPPORTS.COUNT - 1)
      const point = curve.getPointAt(t)
      results.push({
        position: [point.x, point.y / 2, 0] as [number, number, number],
        height: point.y,
      })
    }
    return results
  }, [curve])

  return (
    <>
      {supports.map((support, i) => (
        <mesh key={i} position={support.position} castShadow>
          <cylinderGeometry
            args={[BRIDGE_CONFIG.SUPPORTS.RADIUS, BRIDGE_CONFIG.SUPPORTS.RADIUS * 1.2, support.height, 8]}
          />
          <meshStandardMaterial color={BRIDGE_CONFIG.SUPPORTS.COLOR} roughness={0.9} />
        </mesh>
      ))}
    </>
  )
}

export function Bridge({ position = [0, 1.5, 13] }: { position?: [number, number, number] }) {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)

  const handleClick = () => {
    router.push("/cv")
  }

  // Génération de la courbe du tablier du pont
  const deckCurve = useMemo(
    () => createBridgeCurve(
      BRIDGE_CONFIG.LENGTH, 
      BRIDGE_CONFIG.DECK.CURVE_HEIGHT, 
      BRIDGE_CONFIG.DECK.SEGMENTS,
      BRIDGE_CONFIG.DECK.BASE_HEIGHT
    ),
    []
  )

  return (
    <group 
      position={position}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Sol incurvé marchable qui suit la courbe */}
      <CurvedDeckSurface curve={deckCurve} hovered={hovered} />
      
      {/* Planches décoratives transversales */}
      <DeckPlanks curve={deckCurve} />
      
      {/* Poutres latérales structurelles (taille corrigée) */}
      <SideBeams curve={deckCurve} hovered={hovered} />

      {/* Rambardes des deux côtés */}
      <BridgeRail side="left" curve={deckCurve} />
      <BridgeRail side="right" curve={deckCurve} />

      {/* Poutres de support */}
      <SupportBeams curve={deckCurve} />

      {/* Décorations aux extrémités (style torii miniature) */}
      {[-BRIDGE_CONFIG.LENGTH / 2, BRIDGE_CONFIG.LENGTH / 2].flatMap((x, i) => {
        const t = i === 0 ? 0 : 1
        const point = deckCurve.getPointAt(t)
        return [
          // côté gauche
          <group key={`left-${i}`} position={[point.x, point.y + BRIDGE_CONFIG.RAILS.HEIGHT + 0.1, -BRIDGE_CONFIG.DECK.WIDTH / 2]}>
            <mesh castShadow>
              <boxGeometry args={[0.2, 0.12, 0.8]} />
              <meshStandardMaterial color="#8B0000" roughness={0.7} />
            </mesh>
            {/* Ornement doré */}
            <mesh position={[0, 0.08, 0]} castShadow>
              <boxGeometry args={[0.22, 0.04, 0.85]} />
              <meshStandardMaterial color="#DAA520" metalness={0.6} roughness={0.3} />
            </mesh>
          </group>,
          // côté droit
          <group key={`right-${i}`} position={[point.x, point.y + BRIDGE_CONFIG.RAILS.HEIGHT + 0.1, BRIDGE_CONFIG.DECK.WIDTH / 2]}>
            <mesh castShadow>
              <boxGeometry args={[0.2, 0.12, 0.8]} />
              <meshStandardMaterial color="#8B0000" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.08, 0]} castShadow>
              <boxGeometry args={[0.22, 0.04, 0.85]} />
              <meshStandardMaterial color="#DAA520" metalness={0.6} roughness={0.3} />
            </mesh>
          </group>
        ]
      })}
    </group>
  )
}
