
import { TREE_CONFIG } from "./trees/config"
import { TREE_TYPES } from "./trees/TreeTypes"
import { createSeededRandom, generateTreePositions } from "./trees/tree-utils"
import { RigidBody, CuboidCollider } from "@react-three/rapier"
import { useMemo } from "react"

export function Trees() {
  const treeData = useMemo(
    () => generateTreePositions(TREE_CONFIG.TREE_COUNT, TREE_CONFIG.AREA_SIZE, TREE_CONFIG.SEED),
    []
  )
  // Définir les plages de scale par type d'arbre
  const SCALE_RANGES: Record<string, [number, number]> = {
    classic: [0.8, 1.3],
    bamboo: [0.9, 1.5],
    maple: [0.7, 1.1],
    pine: [0.8, 1.2],
    sakura: [0.9, 1.4],
  }

  const random = useMemo(() => createSeededRandom(TREE_CONFIG.SEED + 99), [])
  const colorMap = useMemo(() => {
    const colorRand = createSeededRandom(TREE_CONFIG.SEED + 42)
    return treeData.map(tree => TREE_TYPES[tree.kind].color(colorRand))
  }, [treeData])

  // Générer un scale aléatoire pour chaque arbre selon son type
  const scaleMap = useMemo(() => {
    return treeData.map(tree => {
      const [min, max] = SCALE_RANGES[tree.kind] || [1, 1.2]
      return min + (max - min) * random()
    })
  }, [treeData, random])

  return (
    <>
      {treeData.map((tree, i) => (
        <RigidBody type="fixed" key={i} position={tree.pos}>
          <CuboidCollider args={TREE_CONFIG.COLLISION.HALF_EXTENTS} />
        </RigidBody>
      ))}
      {treeData.map((tree, i) => {
        const kind = tree.kind;
        const color = colorMap[i];
        const scale = scaleMap[i];
        const typeDef = TREE_TYPES[kind];
        return typeDef.render(tree.pos, color, i, scale);
      })}
    </>
  )
}
  // Verts (pins, érables, buissons)
