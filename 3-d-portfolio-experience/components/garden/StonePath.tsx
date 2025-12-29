import { RigidBody } from "@react-three/rapier"
import { useMemo } from "react"
import * as THREE from "three"
import { PAGODA_CONFIG } from "./elements/pagoda"

export default function StonePath() {
  // Chemin principal (rectangle)
  const mainPath = useMemo(() => ({
    position: [0, 0, -4] as [number, number, number],
    scale: [4.5, 0.18, 24] as [number, number, number],
  }), [])

  // Chemin autour de la pagode : rectangle arrondi, dimensions dynamiques
  const pagodaLoopShape = useMemo(() => {
    const base = PAGODA_CONFIG.BASE_SIZE;
    const margin = 3.5; // marge autour de la pagode
    const width = base + margin * 2;
    const height = base + margin * 2;
    const radius = 4.5;
    const thickness = 2.2;

    // Rectangle extérieur arrondi
    const outer = new THREE.Shape();
    outer.absarc(-width/2 + radius, -height/2 + radius, radius, Math.PI, Math.PI * 1.5);
    outer.lineTo(width/2 - radius, -height/2);
    outer.absarc(width/2 - radius, -height/2 + radius, radius, Math.PI * 1.5, 0);
    outer.lineTo(width/2, height/2 - radius);
    outer.absarc(width/2 - radius, height/2 - radius, radius, 0, Math.PI * 0.5);
    outer.lineTo(-width/2 + radius, height/2);
    outer.absarc(-width/2 + radius, height/2 - radius, radius, Math.PI * 0.5, Math.PI);
    outer.lineTo(-width/2, -height/2 + radius);

    // Rectangle intérieur arrondi (trou)
    const inner = new THREE.Path();
    const w2 = width - thickness * 2;
    const h2 = height - thickness * 2;
    const r2 = Math.max(radius - thickness, 1.5);
    inner.absarc(-w2/2 + r2, -h2/2 + r2, r2, Math.PI, Math.PI * 1.5);
    inner.lineTo(w2/2 - r2, -h2/2);
    inner.absarc(w2/2 - r2, -h2/2 + r2, r2, Math.PI * 1.5, 0);
    inner.lineTo(w2/2, h2/2 - r2);
    inner.absarc(w2/2 - r2, h2/2 - r2, r2, 0, Math.PI * 0.5);
    inner.lineTo(-w2/2 + r2, h2/2);
    inner.absarc(-w2/2 + r2, h2/2 - r2, r2, Math.PI * 0.5, Math.PI);
    inner.lineTo(-w2/2, -h2/2 + r2);
    outer.holes.push(inner);
    return outer;
  }, []);

  return (
    <>
      {/* Chemin principal */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={mainPath.position} scale={mainPath.scale} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#b2a98f" />
        </mesh>
      </RigidBody>
      {/* Chemin autour de la pagode (décalé pour entourer la base) */}
      <RigidBody type="fixed" colliders={false}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.13, 7]} castShadow receiveShadow>
          <shapeGeometry args={[pagodaLoopShape]} />
          <meshStandardMaterial color="#b2a98f" />
        </mesh>
      </RigidBody>
    </>
  )
}
