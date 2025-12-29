import { RigidBody, CuboidCollider } from "@react-three/rapier"

function Rock({ position, scale }: { position: [number, number, number]; scale: number }) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#6b6b6b" roughness={0.95} metalness={0.05} />
    </mesh>
  )
}

export function Rocks() {
  const rocks: Array<{ position: [number, number, number]; scale: number }> = [
    { position: [-8, 0.3, -5], scale: 0.6 },
    { position: [-9.5, 0.25, -4.5], scale: 0.5 },
    { position: [10, 0.4, 6], scale: 0.8 },
    { position: [11.5, 0.3, 7], scale: 0.6 },
    { position: [-5, 0.35, 15], scale: 0.7 },
    { position: [8, 0.3, -12], scale: 0.6 },
  ]

  return (
    <>
      {rocks.map((rock, i) => (
        <RigidBody type="fixed" key={i} position={rock.position}>
          <CuboidCollider args={[rock.scale, rock.scale, rock.scale]} />
          <Rock {...rock} />
        </RigidBody>
      ))}
    </>
  )
}
