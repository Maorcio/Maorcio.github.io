import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { createPortal } from "react-dom"

export function Scroll({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  onOpen,
  isOpen = false,
  label = "",
  onClose,
}: {
  position?: [number, number, number]
  rotation?: [number, number, number]
  onOpen?: () => void
  isOpen?: boolean
  label?: string
  onClose?: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [openAnim, setOpenAnim] = useState(0)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += hovered ? 0.01 : 0
    }
    setOpenAnim((prev) => {
      if (isOpen && prev < 1) return Math.min(prev + 0.08, 1)
      if (!isOpen && prev > 0) return Math.max(prev - 0.08, 0)
      return prev
    })
  })

  const [dimensions, setDimensions] = useState({ width: 6.5, height: 4.2 })
  useEffect(() => {
    function updateDimensions() {
      const w = window.innerWidth
      const h = window.innerHeight
      const base = 6.5
      const parcheminRatio = base / (base / 1.54)
      const viewportRatio = w / h
      let width, height
      if (viewportRatio > parcheminRatio) {
        height = base / parcheminRatio
        width = height * viewportRatio
      } else {
        width = base
        height = width / viewportRatio
      }
      setDimensions({ width, height })
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  return (
    <group position={position} rotation={rotation}>
      {/* Parchemin fermé */}
      {!isOpen && openAnim < 0.01 && (
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={onOpen}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[0.18, 0.18, 1.1, 32]} />
          <meshStandardMaterial 
            color="#e9d8a6" 
            roughness={0.6}
            depthTest={false}
            depthWrite={true}
          />
        </mesh>
      )}
      
      {/* Parchemin ouvert */}
      {(isOpen || openAnim > 0.01) && (
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <mesh 
            position={[0, 0, 0]} 
            scale={[openAnim * dimensions.width, 1, openAnim * dimensions.height]}
            renderOrder={1000}
          >
            <boxGeometry args={[1, 0.05, 1]} />
            <meshStandardMaterial 
              color="#f7ecd0" 
              roughness={0.4}
              depthTest={false}
              depthWrite={true}
            />
          </mesh>
          
          <mesh 
            position={[-openAnim * dimensions.width / 2, 0, 0]}
            renderOrder={1001}
          >
            <cylinderGeometry args={[0.07, 0.07, 1.1, 16]} />
            <meshStandardMaterial 
              color="#b08968"
              depthTest={false}
              depthWrite={true}
            />
          </mesh>
          <mesh 
            position={[openAnim * dimensions.width / 2, 0, 0]}
            renderOrder={1001}
          >
            <cylinderGeometry args={[0.07, 0.07, 1.1, 16]} />
            <meshStandardMaterial 
              color="#b08968"
              depthTest={false}
              depthWrite={true}
            />
          </mesh>
          
          {/* HTML Content en plein écran */}
          {openAnim > 0.95 && (
            <HtmlContent src="/test/portfolio-inspire-ilan.html" onClose={onClose} />
          )}
        </group>
      )}
      
      {/* Ficelle */}
      {!isOpen && openAnim < 0.01 && (
        <>
          <mesh position={[0, 0, 0.56]}>
            <torusGeometry args={[0.19, 0.025, 8, 24]} />
            <meshStandardMaterial color="#b08968" />
          </mesh>
          <mesh position={[0, 0, -0.56]}>
            <torusGeometry args={[0.19, 0.025, 8, 24]} />
            <meshStandardMaterial color="#b08968" />
          </mesh>
        </>
      )}
      
      {/* Etiquette */}
      {label && !isOpen && openAnim < 0.01 && (
        <mesh position={[0.22, 0, 0]} rotation={[0, 0, Math.PI / 8]}>
          <boxGeometry args={[0.18, 0.08, 0.04]} />
          <meshStandardMaterial color="#fff8e1" />
        </mesh>
      )}
    </group>
  )
}

// Composant HTML avec createPortal pour sortir du contexte Three.js
function HtmlContent({ src, onClose }: { src: string, onClose?: () => void }) {
  useEffect(() => {
    // Bloquer le scroll du body principal
    document.body.style.overflow = 'hidden'
    
    return () => {
      // Restaurer le scroll
      document.body.style.overflow = ''
    }
  }, [])

  // Utilise createPortal pour injecter directement dans le body
  return createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 10000,
      backgroundColor: '#fafaf9',
      overflow: 'auto',
      cursor: 'auto',
    }}>
      {/* Bouton fermer */}
      {onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            zIndex: 10002,
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(199, 62, 29, 0.9)'
            e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)'
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
          }}
        >
          ✕
        </button>
      )}
      
      <iframe
        src={src}
        title="Portfolio"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
          backgroundColor: '#fafaf9',
        }}
        allow="fullscreen"
      />
    </div>,
    document.body
  )
}
