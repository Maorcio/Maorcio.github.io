import { useMemo } from "react"
import { RigidBody, CuboidCollider } from "@react-three/rapier"
import * as THREE from "three"

function GravelPattern() {
  // Texture procédurale pour le gravier avec motifs de râteau zen
  const gravelTexture = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 2048
    canvas.height = 2048
    const ctx = canvas.getContext("2d")!

    // Base de gravier beige
    ctx.fillStyle = "#c4b5a0"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Texture granuleuse du gravier (petits grains statiques)
    for (let i = 0; i < 12000; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 2 + 0.5
      const shade = Math.random() * 30 - 15
      const color = 196 + shade
      ctx.fillStyle = `rgb(${color}, ${color - 8}, ${color - 16})`
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }

    // Lignes de râteau zen DROITES (parallèles)
    ctx.strokeStyle = "rgba(145, 130, 110, 0.5)"
    ctx.lineWidth = 4
    
    const lineSpacing = 30 // Espacement entre les rainures

    for (let y = 0; y < canvas.height; y += lineSpacing) {
      // Ligne principale (rainure)
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()

      // Ligne d'ombre pour effet 3D de la rainure
      ctx.strokeStyle = "rgba(80, 70, 60, 0.25)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, y + 2)
      ctx.lineTo(canvas.width, y + 2)
      ctx.stroke()

      // Ligne de lumière (haut de la rainure)
      ctx.strokeStyle = "rgba(220, 210, 190, 0.3)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, y - 1)
      ctx.lineTo(canvas.width, y - 1)
      ctx.stroke()

      // Reset pour la prochaine ligne
      ctx.strokeStyle = "rgba(145, 130, 110, 0.5)"
      ctx.lineWidth = 4
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(3, 3)
    return texture
  }, [])

  // Normal map pour relief du gravier
  const normalMap = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext("2d")!

    ctx.fillStyle = "#8080ff" // Normal neutre
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Petites variations pour relief des grains
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 1.5 + 0.5
      const normalVariation = Math.random() * 40 + 110
      ctx.fillStyle = `rgb(${normalVariation}, ${normalVariation}, 255)`
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(8, 8)
    return texture
  }, [])

  // Roughness map pour variations mat/brillant
  const roughnessMap = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext("2d")!

    ctx.fillStyle = "#e0e0e0" // Base mate
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Zones légèrement plus brillantes (petites pierres)
    for (let i = 0; i < 1500; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 2 + 1
      const brightness = Math.random() * 80 + 120
      ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(8, 8)
    return texture
  }, [])

  return { gravelTexture, normalMap, roughnessMap }
}

// Fonction pour créer un rocher organique avec forme irrégulière
function createRockGeometry(size: number, seed: number) {
  const geometry = new THREE.SphereGeometry(size, 16, 12)
  const positionAttribute = geometry.getAttribute('position')
  
  // Déformation des vertices pour créer une forme organique
  for (let i = 0; i < positionAttribute.count; i++) {
    const x = positionAttribute.getX(i)
    const y = positionAttribute.getY(i)
    const z = positionAttribute.getZ(i)
    
    // Utilise le seed pour des variations reproductibles
    const noise1 = Math.sin(x * 2.5 + seed) * Math.cos(y * 2.3 + seed)
    const noise2 = Math.sin(z * 2.8 + seed) * Math.cos(x * 2.1 + seed)
    const noise3 = Math.cos(y * 2.6 + seed) * Math.sin(z * 2.4 + seed)
    
    const deformation = (noise1 + noise2 + noise3) * 0.35
    
    positionAttribute.setXYZ(
      i,
      x * (1 + deformation),
      y * (1 + deformation * 0.8), // Moins de déformation en Y pour aplatir
      z * (1 + deformation)
    )
  }
  
  geometry.computeVertexNormals()
  return geometry
}

function Ground() {
  const { gravelTexture, normalMap, roughnessMap } = GravelPattern()

  // Positions fixes pour les rochers avec seeds pour formes uniques
  const rockPositions = useMemo(() => [
    // Rochers décoratifs principaux (gros)
    { x: -12, z: -18, size: 1.8, rotation: [0.2, 0.5, 0.1], seed: 1.2 },
    { x: 18, z: 12, size: 2.0, rotation: [0.1, 1.2, 0.3], seed: 2.5 },
    { x: -20, z: 15, size: 1.5, rotation: [0.3, 0.8, 0.2], seed: 3.8 },
    { x: 15, z: -22, size: 1.7, rotation: [0.4, 1.5, 0.1], seed: 4.1 },
    
    // Petites pierres d'accent
    { x: -8, z: -15, size: 0.8, rotation: [0.2, 0.3, 0.4], seed: 5.3 },
    { x: 20, z: 10, size: 0.9, rotation: [0.5, 0.7, 0.2], seed: 6.7 },
    { x: -18, z: 18, size: 0.7, rotation: [0.3, 1.1, 0.5], seed: 7.4 },
    { x: 12, z: -20, size: 0.85, rotation: [0.1, 0.9, 0.3], seed: 8.9 },
  ], [])

  // Génération des géométries de rochers
  const rockGeometries = useMemo(() => 
    rockPositions.map(rock => createRockGeometry(rock.size, rock.seed)),
    [rockPositions]
  )

  return (
    <RigidBody type="fixed" position={[0, 0, 0]}>
      <CuboidCollider args={[50, 0.1, 50]} />
      <group>
        {/* Sol principal avec textures procédurales */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100, 64, 64]} />
          <meshStandardMaterial
            map={gravelTexture}
            normalMap={normalMap}
            normalScale={new THREE.Vector2(0.3, 0.3)}
            roughnessMap={roughnessMap}
            roughness={0.95}
            metalness={0.02}
          />
        </mesh>

        {/* Rochers organiques avec motifs circulaires autour */}
        {rockPositions.map((rock, idx) => (
          <group key={`rock-group-${idx}`}>
            {/* Rocher principal avec géométrie organique */}
            <mesh
              position={[rock.x, rock.size * 0.35, rock.z]}
              rotation={rock.rotation as [number, number, number]}
              castShadow
              receiveShadow
              geometry={rockGeometries[idx]}
            >
              <meshStandardMaterial
                color={`hsl(0, 0%, ${30 + (idx % 3) * 5}%)`}
                roughness={0.92}
                metalness={0.05}
              />
            </mesh>

            {/* Motifs circulaires AUTOUR du rocher (rainures concentriques) */}
            {rock.size > 1.2 && (
              <group position={[rock.x, 0.03, rock.z]}>
                {[
                  rock.size * 1.5,
                  rock.size * 2.0,
                  rock.size * 2.5
                ].map((radius, circleIdx) => (
                  <mesh
                    key={`circle-${circleIdx}`}
                    rotation={[-Math.PI / 2, 0, 0]}
                  >
                    <ringGeometry args={[radius, radius + 0.06, 64]} />
                    <meshStandardMaterial
                      color="#a89878"
                      transparent
                      opacity={0.7 - circleIdx * 0.15}
                      roughness={0.9}
                    />
                  </mesh>
                ))}
              </group>
            )}
          </group>
        ))}

        {/* Bordure de pierres plates (fixes) */}
        {Array.from({ length: 32 }, (_, i) => {
          const angle = (i / 32) * Math.PI * 2
          const radius = 47
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          const size = 0.4 + (i % 3) * 0.15
          
          return (
            <mesh
              key={`border-stone-${i}`}
              position={[x, size * 0.3, z]}
              rotation={[Math.PI * 0.05, angle, Math.PI * 0.02]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[size * 2, size * 0.6, size * 1.5]} />
              <meshStandardMaterial
                color="#4a4a4a"
                roughness={0.9}
                metalness={0.08}
              />
            </mesh>
          )
        })}
      </group>
    </RigidBody>
  )
}

export default Ground
