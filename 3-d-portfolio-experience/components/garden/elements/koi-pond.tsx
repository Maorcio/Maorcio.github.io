"use client"

import React, { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useGLTF } from '@react-three/drei'

function randomBeanPoint(t: number, beanA = 2.5, beanB = 1.2) {
  // Paramétrisation d'une haricot (bean) :
  // x = cos(t) * (beanA + beanB * cos(t)), y = sin(t) * (beanA + beanB * cos(t))
  const x = Math.cos(t) * (beanA + beanB * Math.cos(t));
  const y = Math.sin(t) * (beanA + beanB * Math.cos(t));
  return [x, y];
}

function KoiFish({ center, beanA = 2.5, beanB = 1.2, speed = 1, zOffset = 0 }: { center: [number, number, number]; beanA?: number; beanB?: number; speed?: number; zOffset?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const angle = useRef(Math.random() * Math.PI * 2)

  useFrame((state, delta) => {
    if (!meshRef.current) return
    angle.current += delta * speed * 0.25
    const [x, y] = randomBeanPoint(angle.current, beanA, beanB)
    meshRef.current.position.x = center[0] + x
    meshRef.current.position.z = center[2] + y + zOffset
    meshRef.current.position.y = center[1] + 0.3
    meshRef.current.rotation.y = angle.current + Math.PI / 2
  })

  const handleClick = () => {
    window.open("https://linkedin.com", "_blank")
  }

  return (
    <mesh
      ref={meshRef}
      position={center}
      onClick={handleClick}
      onPointerOver={() => { document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = "auto"; }}
    >
      <group>
        <mesh castShadow>
          <capsuleGeometry args={[0.15, 0.6, 8, 16]} />
          <meshStandardMaterial color="#ff6b35" roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[-0.4, 0, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
          <coneGeometry args={[0.15, 0.3, 8]} />
          <meshStandardMaterial color="#ff8c61" roughness={0.4} />
        </mesh>
      </group>
    </mesh>
  );
}

// Position du bassin derrière la pagode (par défaut z=13)
export function KoiPond({ position = [0, 0, 80], baseOffsetY }: { position?: [number, number, number], baseOffsetY?: number }) {
  baseOffsetY = baseOffsetY ?? 0;
  const gltf = useGLTF('/models/model.glb');
  const scale = 10;
  // Calcul du yOffset une seule fois après chargement du modèle
  const yOffset = React.useMemo(() => {
    let baseY = 0;
    let yOffsetCalc = 0;
    try {
      const bbox = new THREE.Box3().setFromObject(gltf.scene);
      baseY = bbox.min.y;
      yOffsetCalc = isFinite(baseY) && Math.abs(baseY) < 1000 ? -baseY * scale : 0;
    } catch (e) {
      yOffsetCalc = 0;
    }
    if (yOffsetCalc === 0 && baseOffsetY === 0) {
      return 2; // à ajuster selon le modèle
    } else {
      return yOffsetCalc + baseOffsetY;
    }
  }, [gltf.scene, baseOffsetY]);
  const pondCenter: [number, number, number] = [position[0], position[1] + yOffset, position[2]];
  return (
    <group position={pondCenter} rotation={[0, Math.PI, 0]}>
      {/* Nouveau modèle GLB à la place du bassin, taille x10 et base posée au sol */}
      <primitive object={gltf.scene} scale={[scale, scale, scale]} />
      {/* Poissons */}
      <KoiFish center={[0, 0, 0]} speed={0.8} />
      <KoiFish center={[0, 0, 0]} speed={1.2} zOffset={0.2} />
      <KoiFish center={[0, 0, 0]} speed={1} zOffset={-0.2} />
    </group>
  );
}
