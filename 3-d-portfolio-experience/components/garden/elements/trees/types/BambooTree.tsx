import { ReactNode } from "react"

export const BambooTree = {
  label: "Bambou",
  color: () => "#7fb069", // Vert bambou authentique
  trunk: { radiusTop: 0.08, radiusBottom: 0.1, height: 6 },
  foliage: { radius: 0.3, y: 5 },
  render: (pos: [number, number, number], color: string, i: number, scale: number = 1): ReactNode => {
    const bambooGreen = "#7fb069"
    const bambooYellow = "#b8c77d"
    const nodeColor = "#5a7a4a"
    const leafColor = "#6b9f5c"
    
    const segments = 6
    const segmentHeight = 1
    const nodeHeight = 0.15
    const radius = 0.08
    
    return (
      <group key={`bamboo-${i}`} position={pos} scale={[scale, scale, scale]}>
        {/* Segments de bambou avec alternance de couleurs */}
        {Array.from({ length: segments }, (_, segIndex) => {
          const yPos = segIndex * (segmentHeight + nodeHeight) + segmentHeight / 2
          const segColor = segIndex % 2 === 0 ? bambooGreen : bambooYellow
          
          return (
            <group key={segIndex}>
              {/* Segment cylindrique */}
              <mesh position={[0, yPos, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[radius * 0.95, radius, segmentHeight, 16]} />
                <meshStandardMaterial 
                  color={segColor} 
                  roughness={0.6} 
                  metalness={0.1}
                />
              </mesh>
              
              {/* Nœud (anneau caractéristique du bambou) */}
              <mesh position={[0, yPos + segmentHeight / 2, 0]} castShadow>
                <cylinderGeometry args={[radius * 1.2, radius * 1.15, nodeHeight, 16]} />
                <meshStandardMaterial 
                  color={nodeColor} 
                  roughness={0.8}
                />
              </mesh>
              
              {/* Petit anneau décoratif sur le nœud */}
              <mesh position={[0, yPos + segmentHeight / 2 + nodeHeight / 4, 0]}>
                <torusGeometry args={[radius * 1.1, 0.02, 8, 16]} />
                <meshStandardMaterial color="#4a5a3a" roughness={0.9} />
              </mesh>
            </group>
          )
        })}
        
        {/* Feuilles au sommet - disposition en éventail typique du bambou */}
        <group position={[0, segments * (segmentHeight + nodeHeight), 0]}>
          {/* Couronne principale de feuilles */}
          {Array.from({ length: 8 }, (_, leafIndex) => {
            const angle = (leafIndex / 8) * Math.PI * 2
            const leafLength = 0.8
            const leafWidth = 0.15
            const xOffset = Math.cos(angle) * 0.15
            const zOffset = Math.sin(angle) * 0.15
            const leafAngle = angle + Math.PI / 2
            
            return (
              <group 
                key={leafIndex}
                position={[xOffset, 0, zOffset]}
                rotation={[Math.PI / 6, leafAngle, 0]}
              >
                {/* Feuille allongée caractéristique */}
                <mesh castShadow>
                  <boxGeometry args={[leafWidth, 0.02, leafLength]} />
                  <meshStandardMaterial 
                    color={leafColor} 
                    roughness={0.7}
                    side={2} // DoubleSide
                  />
                </mesh>
                
                {/* Nervure centrale de la feuille */}
                <mesh position={[0, 0.015, 0]}>
                  <boxGeometry args={[0.02, 0.01, leafLength]} />
                  <meshStandardMaterial color="#4a5a3a" roughness={0.9} />
                </mesh>
              </group>
            )
          })}
          
          {/* Deuxième niveau de feuilles plus petit */}
          {Array.from({ length: 6 }, (_, leafIndex) => {
            const angle = (leafIndex / 6) * Math.PI * 2 + 0.3
            const leafLength = 0.6
            const leafWidth = 0.12
            const xOffset = Math.cos(angle) * 0.1
            const zOffset = Math.sin(angle) * 0.1
            const leafAngle = angle + Math.PI / 2
            
            return (
              <group 
                key={`inner-${leafIndex}`}
                position={[xOffset, -0.3, zOffset]}
                rotation={[Math.PI / 5, leafAngle, 0]}
              >
                <mesh castShadow>
                  <boxGeometry args={[leafWidth, 0.02, leafLength]} />
                  <meshStandardMaterial 
                    color={leafColor} 
                    roughness={0.7}
                    side={2}
                  />
                </mesh>
              </group>
            )
          })}
          
          {/* Petites feuilles au centre (jeunes pousses) */}
          {Array.from({ length: 4 }, (_, leafIndex) => {
            const angle = (leafIndex / 4) * Math.PI * 2
            const leafLength = 0.4
            const leafWidth = 0.08
            const xOffset = Math.cos(angle) * 0.05
            const zOffset = Math.sin(angle) * 0.05
            
            return (
              <group 
                key={`center-${leafIndex}`}
                position={[xOffset, 0.2, zOffset]}
                rotation={[Math.PI / 8, angle, 0]}
              >
                <mesh castShadow>
                  <boxGeometry args={[leafWidth, 0.02, leafLength]} />
                  <meshStandardMaterial 
                    color="#8fb573" 
                    roughness={0.6}
                    side={2}
                  />
                </mesh>
              </group>
            )
          })}
        </group>
        
        {/* Petites pousses latérales (branches secondaires) */}
        {[2, 3, 4].map((segIndex) => {
          const yPos = segIndex * (segmentHeight + nodeHeight)
          const angle = (segIndex * 2.3) % (Math.PI * 2)
          const xOffset = Math.cos(angle) * 0.12
          const zOffset = Math.sin(angle) * 0.12
          
          return (
            <group key={`branch-${segIndex}`} position={[xOffset, yPos, zOffset]}>
              {/* Mini branche */}
              <mesh 
                rotation={[0, 0, Math.PI / 6]}
                castShadow
              >
                <cylinderGeometry args={[0.03, 0.04, 0.4, 8]} />
                <meshStandardMaterial color="#6b9f5c" roughness={0.7} />
              </mesh>
              
              {/* Petites feuilles sur la branche */}
              {[0, 1, 2].map((leafIdx) => (
                <mesh
                  key={leafIdx}
                  position={[0.1 + leafIdx * 0.08, 0.05 * leafIdx, 0]}
                  rotation={[Math.PI / 4, leafIdx * 0.5, 0]}
                  castShadow
                >
                  <boxGeometry args={[0.06, 0.01, 0.25]} />
                  <meshStandardMaterial 
                    color={leafColor} 
                    roughness={0.7}
                    side={2}
                  />
                </mesh>
              ))}
            </group>
          )
        })}
      </group>
    )
  }
} as const
