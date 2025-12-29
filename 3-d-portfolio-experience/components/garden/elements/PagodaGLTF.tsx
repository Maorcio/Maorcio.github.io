import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { Object3D, Mesh, Material } from 'three'

/**
 * PagodaGLTF
 * Props :
 *   - position : [x, y, z] (y ignoré, auto-aligné)
 *   - scale : [x, y, z]
 *   - baseOffsetY : correction manuelle (optionnelle)
 */
type PagodaGLTFProps = {
  position?: [number, number, number]
  scale?: [number, number, number]
  baseOffsetY?: number
  [key: string]: any
}

export function PagodaGLTF(props: PagodaGLTFProps) {
  const { scene } = useGLTF('/models/pagoda.glb')
  // Clone la scène pour éviter les effets de bord et désactive les ombres
  const optimizedScene = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((obj: Object3D) => {
      if ((obj as Mesh).isMesh) {
        const mesh = obj as Mesh
        mesh.castShadow = false
        mesh.receiveShadow = false
        if (mesh.material && 'shadowSide' in mesh.material) {
          (mesh.material as Material & { shadowSide?: any }).shadowSide = null
        }
      }
    })
    return clone
  }, [scene])

  // Décalage vertical stabilisé avec useMemo
  const baseOffsetY = props.baseOffsetY ?? 0;
  const yOffset = useMemo(() => {
    let baseY = 0;
    let yOffsetCalc = 0;
    try {
      const box = new THREE.Box3().setFromObject(optimizedScene);
      baseY = box.min.y;
      yOffsetCalc = isFinite(baseY) && Math.abs(baseY) < 1000 ? -baseY : 0;
    } catch (e) {
      yOffsetCalc = 0;
    }
    if (yOffsetCalc === 0 && baseOffsetY === 0) {
      return 2; // à ajuster selon le modèle
    } else {
      return yOffsetCalc + baseOffsetY;
    }
  }, [optimizedScene, baseOffsetY]);
  const position = props.position ? [...props.position] : [0, 0, 0];
  position[1] = (props.position?.[1] ?? 0) + yOffset;
  // On retire baseOffsetY de props pour éviter un warning React
  const { baseOffsetY: _, ...rest } = props;
  return <primitive object={optimizedScene} {...rest} position={position} />;
}
