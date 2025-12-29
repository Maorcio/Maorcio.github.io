import { ReactNode } from "react"
import { FOLIAGE_COLORS } from "../TreeTypes"

export const MapleTree = {
  label: "Érable japonais",
  color: (rand: () => number) => FOLIAGE_COLORS[6 + Math.floor(rand() * 3)],
  trunk: { radiusTop: 0.18, radiusBottom: 0.28, height: 2.8 },
  foliage: { radius: 1.7, y: 3.2 },
  render: (pos: [number, number, number], color: string, i: number, scale: number = 1): ReactNode => {
    const trunkColor = "#5a3a2a"
    const branchColor = "#6b4a3a"
    
    // Variation de couleur pour le feuillage
    const leafVariations = [color, color, color]
    
    return (
      <group key={`maple-${i}`} position={pos} scale={[scale, scale, scale]}>
        {/* Tronc principal avec texture écorce */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.18, 0.28, 2.8, 12]} />
          <meshStandardMaterial 
            color={trunkColor} 
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        
        {/* Branches principales tortueuses (caractéristique de l'érable japonais) */}
        {[
          { angle: 0, tilt: Math.PI / 6, length: 1.2, yStart: 2.0 },
          { angle: Math.PI * 0.6, tilt: Math.PI / 5, length: 1.4, yStart: 1.8 },
          { angle: Math.PI * 1.2, tilt: Math.PI / 5.5, length: 1.3, yStart: 2.2 },
          { angle: Math.PI * 1.8, tilt: Math.PI / 6.5, length: 1.1, yStart: 1.6 },
          { angle: Math.PI * 0.3, tilt: Math.PI / 7, length: 1.0, yStart: 2.4 },
        ].map((branch, idx) => {
          const xOffset = Math.cos(branch.angle) * 0.15
          const zOffset = Math.sin(branch.angle) * 0.15
          
          return (
            <group 
              key={`branch-${idx}`}
              position={[xOffset, branch.yStart, zOffset]}
              rotation={[0, branch.angle, branch.tilt]}
            >
              {/* Branche principale courbée */}
              <mesh castShadow>
                <cylinderGeometry args={[0.08, 0.12, branch.length, 8]} />
                <meshStandardMaterial color={branchColor} roughness={0.85} />
              </mesh>
              
              {/* Groupe de feuillage à l'extrémité de la branche */}
              <group position={[0, branch.length / 2 + 0.3, 0]}>
                {/* Feuillage principal dense */}
                <mesh castShadow receiveShadow>
                  <sphereGeometry args={[0.6, 10, 10]} />
                  <meshStandardMaterial 
                    color={color} 
                    roughness={0.7} 
                    transparent 
                    opacity={0.85}
                  />
                </mesh>
                
                {/* Petits groupes de feuilles qui dépassent (effet naturel) */}
                {[0, 1, 2].map((leafCluster) => {
                  const clusterAngle = (leafCluster / 3) * Math.PI * 2
                  const clusterDist = 0.4
                  
                  return (
                    <mesh
                      key={leafCluster}
                      position={[
                        Math.cos(clusterAngle) * clusterDist,
                        (leafCluster - 1) * 0.15,
                        Math.sin(clusterAngle) * clusterDist
                      ]}
                      castShadow
                    >
                      <sphereGeometry args={[0.25, 8, 8]} />
                      <meshStandardMaterial 
                        color={color} 
                        roughness={0.7} 
                        transparent 
                        opacity={0.8}
                      />
                    </mesh>
                  )
                })}
              </group>
              
              {/* Branche secondaire */}
              <group 
                position={[0, branch.length * 0.6, 0]}
                rotation={[0, Math.PI / 3, -branch.tilt * 0.5]}
              >
                <mesh castShadow>
                  <cylinderGeometry args={[0.04, 0.06, 0.6, 6]} />
                  <meshStandardMaterial color={branchColor} roughness={0.85} />
                </mesh>
                
                {/* Petit groupe de feuilles sur branche secondaire */}
                <mesh position={[0, 0.4, 0]} castShadow>
                  <sphereGeometry args={[0.35, 8, 8]} />
                  <meshStandardMaterial 
                    color={color} 
                    roughness={0.7} 
                    transparent 
                    opacity={0.82}
                  />
                </mesh>
              </group>
            </group>
          )
        })}
        
        {/* Couronne centrale au sommet */}
        <group position={[0, 2.8, 0]}>
          {/* Masse centrale de feuillage */}
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.8, 12, 12]} />
            <meshStandardMaterial 
              color={color} 
              roughness={0.7} 
              transparent 
              opacity={0.88}
            />
          </mesh>
          
          {/* Petites branches qui dépassent du sommet */}
          {[0, 1, 2, 3].map((topBranch) => {
            const angle = (topBranch / 4) * Math.PI * 2
            const dist = 0.5
            
            return (
              <group
                key={`top-${topBranch}`}
                position={[
                  Math.cos(angle) * dist,
                  0.2,
                  Math.sin(angle) * dist
                ]}
              >
                {/* Petite branche fine */}
                <mesh
                  rotation={[Math.PI / 8, angle, 0]}
                  castShadow
                >
                  <cylinderGeometry args={[0.02, 0.03, 0.4, 6]} />
                  <meshStandardMaterial color={branchColor} roughness={0.85} />
                </mesh>
                
                {/* Petit groupe de feuilles */}
                <mesh
                  position={[
                    Math.cos(angle) * 0.15,
                    0.25,
                    Math.sin(angle) * 0.15
                  ]}
                  castShadow
                >
                  <sphereGeometry args={[0.2, 8, 8]} />
                  <meshStandardMaterial 
                    color={color} 
                    roughness={0.7} 
                    transparent 
                    opacity={0.85}
                  />
                </mesh>
              </group>
            )
          })}
        </group>
        
        {/* Feuilles individuelles dispersées (effet détaillé) */}
        {Array.from({ length: 12 }, (_, leafIdx) => {
          const angle = (leafIdx / 12) * Math.PI * 2 + Math.sin(leafIdx) * 0.5
          const radius = 1.2 + Math.cos(leafIdx * 1.3) * 0.4
          const height = 2.5 + Math.sin(leafIdx * 0.8) * 0.8
          
          return (
            <mesh
              key={`leaf-${leafIdx}`}
              position={[
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
              ]}
              rotation={[
                Math.random() * Math.PI / 4,
                angle,
                Math.random() * Math.PI / 6
              ]}
              castShadow
            >
              {/* Forme de feuille d'érable (simplifiée avec icosaèdre) */}
              <icosahedronGeometry args={[0.15, 0]} />
              <meshStandardMaterial 
                color={color} 
                roughness={0.6} 
                transparent 
                opacity={0.9}
                side={2}
              />
            </mesh>
          )
        })}
      </group>
    )
  }
} as const
