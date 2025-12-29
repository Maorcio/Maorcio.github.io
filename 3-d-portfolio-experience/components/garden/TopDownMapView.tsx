import { useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { OrthographicCamera } from "three"

export default function TopDownMapView() {
  const { gl, scene, size } = useThree()
  const cameraRef = useRef<OrthographicCamera | null>(null)
  const width = 40
  const height = 40

  useEffect(() => {
    if (!cameraRef.current) return
    cameraRef.current.position.set(0, 50, 0)
    cameraRef.current.lookAt(0, 0, 0)
    cameraRef.current.updateProjectionMatrix()
  }, [])

  useEffect(() => {
    if (!cameraRef.current) return
    cameraRef.current.left = -width / 2
    cameraRef.current.right = width / 2
    cameraRef.current.top = height / 2
    cameraRef.current.bottom = -height / 2
    cameraRef.current.updateProjectionMatrix()
  }, [size])

  // Optionnel : overlay dans un coin
  // On pourrait utiliser un portail ou un canvas séparé pour afficher la minimap

  return (
    <orthographicCamera
      ref={cameraRef}
      args={[-width / 2, width / 2, height / 2, -height / 2, 1, 100]}
      position={[0, 50, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      makeDefault={false}
    />
  )
}
