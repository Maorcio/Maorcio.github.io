"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useThree } from "@react-three/fiber"
import * as THREE from "three"
import { projects } from "../ui/parchment-overlay"
import { useParchment } from "../ui/parchment-context"
import { Text, Html } from "@react-three/drei"
import { RigidBody, CuboidCollider } from "@react-three/rapier"

function Lantern({
  position,
  projectId,
  night = false
}: {
  position: [number, number, number]
  projectId: string
  night?: boolean
}) {
  const project = projects?.find?.(p => p.id === projectId)
  const router = useRouter()
  const [hovered, setHovered] = useState(false)
  const [canInteract, setCanInteract] = useState(false)
  const { camera } = useThree()
  const openParchment = useParchment().openParchment

  // Animation de la flamme
  const [flameOffset, setFlameOffset] = useState(0)
  useEffect(() => {
    if (!night) return
    const interval = setInterval(() => {
      setFlameOffset(Math.sin(Date.now() * 0.003) * 0.15)
    }, 50)
    return () => clearInterval(interval)
  }, [night])

  // Détection de proximité et de visée
  useEffect(() => {
    function checkProximityAndLook() {
      if (!camera) return setCanInteract(false)
      const dx = camera.position.x - position[0]
      const dz = camera.position.z - position[2]
      const dist = Math.sqrt(dx * dx + dz * dz)
      const camDir = new THREE.Vector3()
      camera.getWorldDirection(camDir)
      const lanternDir = new THREE.Vector3(
        position[0] - camera.position.x,
        0,
        position[2] - camera.position.z
      ).normalize()
      const dot = camDir.x * lanternDir.x + camDir.z * lanternDir.z
      setCanInteract(dot > 0.3 && dist < 8)
    }
    const interval = setInterval(checkProximityAndLook, 100)
    return () => clearInterval(interval)
  }, [position, camera])

  // Gestion de la touche E
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (canInteract && project && (e.key === "e" || e.key === "E")) {
        console.log("[Lantern] Ouverture du parchemin", project.id)
        openParchment("projects", project.id)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [canInteract, openParchment, project])

  useEffect(() => {
    if (!project && canInteract) setCanInteract(false)
  }, [project, canInteract])

  return (
    <group
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Box de collision invisible */}
      <mesh position={[0, 1.5, 0]} visible={false}>
        <boxGeometry args={[1.2, 3.2, 1.2]} />
      </mesh>

      {/* Box de détection visuelle */}
      {canInteract && (
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[1.2, 3.2, 1.2]} />
          <meshStandardMaterial color="#ffcc99" transparent opacity={0.18} />
        </mesh>
      )}

      {/* Prompt d'interaction */}
      {canInteract && (
        <Html center position={[0, 2.7, 0]} zIndexRange={[100, 0]}>
          <div
            style={{
              background: "rgba(255,255,255,0.92)",
              borderRadius: 8,
              padding: "4px 14px",
              fontWeight: 600,
              color: "#2a2a2a",
              fontSize: 18,
              boxShadow: "0 2px 8px #0002",
            }}
          >
            Appuyez sur <span style={{ color: "#b77" }}>E</span> pour ouvrir le parchemin
          </div>
        </Html>
      )}

      {/* === BASE PIERRE (Ishidōrō style) === */}
      {/* Socle inférieur */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.2, 0.7]} />
        <meshStandardMaterial color="#505050" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Piédestal octogonal */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.32, 0.35, 8]} />
        <meshStandardMaterial color="#555555" roughness={0.85} />
      </mesh>

      {/* Plateau intermédiaire */}
      <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.3, 0.12, 8]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
      </mesh>

      {/* === POTEAU VERTICAL === */}
      <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.08, 1.02, 16]} />
        <meshStandardMaterial color="#2a2020" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Anneau décoratif mi-hauteur */}
      <mesh position={[0, 1, 0]} castShadow>
        <torusGeometry args={[0.11, 0.025, 8, 16]} />
        <meshStandardMaterial color="#1a1515" roughness={0.6} />
      </mesh>

      {/* === STRUCTURE LANTERNE (Chōchin style) === */}
      {/* Plateforme support */}
      <mesh position={[0, 1.72, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.35, 0.08, 6]} />
        <meshStandardMaterial color="#1a1515" roughness={0.7} />
      </mesh>

      {/* Cadre hexagonal supérieur */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.04, 6]} />
        <meshStandardMaterial color="#2a2020" roughness={0.6} />
      </mesh>

      {/* Corps de la lanterne en papier washi */}
      <mesh position={[0, 2.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.7, 6]} />
        <meshStandardMaterial
          color={night ? "#fff8f0" : hovered ? "#fff5e8" : "#ffeedd"}
          roughness={0.9}
          emissive={night ? "#ffb366" : hovered ? "#ff9944" : "#ffaa66"}
          emissiveIntensity={night ? 1.8 + flameOffset : hovered ? 0.6 : 0.2}
          transparent
          opacity={0.88}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Nervures verticales (structure bambou) */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2
        const x = Math.cos(angle) * 0.35
        const z = Math.sin(angle) * 0.35
        return (
          <mesh key={i} position={[x, 2.15, z]} castShadow>
            <boxGeometry args={[0.015, 0.72, 0.015]} />
            <meshStandardMaterial color="#3a2a1a" roughness={0.8} />
          </mesh>
        )
      })}

      {/* Anneaux horizontaux décoratifs */}
      <mesh position={[0, 1.95, 0]} castShadow>
        <torusGeometry args={[0.36, 0.012, 6, 6]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.35, 0]} castShadow>
        <torusGeometry args={[0.36, 0.012, 6, 6]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.7} />
      </mesh>

      {/* Cadre hexagonal inférieur */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.04, 6]} />
        <meshStandardMaterial color="#2a2020" roughness={0.6} />
      </mesh>

      {/* === TOIT (Yane) === */}
      {/* Toit principal hexagonal */}
      <mesh position={[0, 2.68, 0]} castShadow>
        <coneGeometry args={[0.52, 0.25, 6]} />
        <meshStandardMaterial color="#1a1515" roughness={0.5} metalness={0.15} />
      </mesh>

      {/* Ornement sommet (Hōju) */}
      <mesh position={[0, 2.88, 0]} castShadow>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#2a2020" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 2.98, 0]} castShadow>
        <coneGeometry args={[0.05, 0.12, 6]} />
        <meshStandardMaterial color="#1a1515" roughness={0.5} />
      </mesh>

      {/* === CALLIGRAPHIE / NOM DU PROJET === */}
      {project?.title && (
        <>
          {/* Plaque en bois */}
          <mesh position={[0, 0.55, 0.36]} castShadow receiveShadow>
            <boxGeometry args={[0.5, 0.14, 0.02]} />
            <meshStandardMaterial color="#3a2515" roughness={0.8} />
          </mesh>
          {/* Texte gravé */}
          <Text
            position={[0, 0.55, 0.38]}
            fontSize={0.08}
            color="#e8d4b8"
            anchorX="center"
            anchorY="middle"
            maxWidth={0.45}
            font="/fonts/NotoSerifJP-Medium.ttf"
            outlineColor="#1a1515"
            outlineWidth={0.008}
          >
            {project.title}
          </Text>
        </>
      )}

      {/* === LUMIÈRE === */}
      {night && (
        <>
          {/* Lumière principale */}
          <pointLight
            position={[0, 2.15, 0]}
            intensity={3.5 + flameOffset}
            distance={9}
            color="#ffaa66"
            castShadow
          />
          {/* Lumière d'ambiance chaude */}
          <pointLight
            position={[0, 2.15, 0]}
            intensity={1.2}
            distance={4}
            color="#ff8844"
          />
        </>
      )}
      {!night && hovered && (
        <pointLight position={[0, 2.15, 0]} intensity={0.5} distance={2.5} color="#ffaa66" />
      )}
    </group>
  )
}

export function Lanterns({ night = false }: { night?: boolean }) {
  const count = 4
  const spacing = 8
  const offsetX = 2.1
  const stoneY = 0.09
  const lanternBaseY = 0.1
  const y = stoneY + lanternBaseY
  const startZ = -35

  const lanternData = []
  for (let i = 0; i < count; i++) {
    const z = startZ + i * spacing + spacing
    lanternData.push({ position: [-offsetX, y, z] as [number, number, number], projectId: `project-${i * 2 + 1}` })
    lanternData.push({ position: [offsetX, y, z] as [number, number, number], projectId: `project-${i * 2 + 2}` })
  }

  return (
    <RigidBody type="fixed">
      <CuboidCollider args={[0.5, 1, 0.5]} />
      <>
        {lanternData.map((data, i) => (
          <Lantern key={i} {...data} night={night} />
        ))}
      </>
    </RigidBody>
  )
}
