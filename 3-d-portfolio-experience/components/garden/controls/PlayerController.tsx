import { RigidBody, CapsuleCollider } from "@react-three/rapier"
import { useThree, useFrame } from "@react-three/fiber"
import { useRef, useEffect } from "react"
import * as THREE from "three"

// Pivot vertical pour la caméra
function CameraPitch({ camera }: { camera: THREE.Camera }) {
    const pitchRef = useRef<THREE.Group>(null)
    useFrame(() => {
        if (pitchRef.current) {
            pitchRef.current.position.copy(camera.position)
        }
    })
    return <group ref={pitchRef}>{/* La caméra est gérée par useThree */}</group>
}

// Contrôleur FPS : déplacement WASD + rotation souris
export function PlayerController() {
    const { camera } = useThree()
    const rigidBodyRef = useRef<any>(null)
    const velocity = useRef([0, 0, 0])
    const direction = useRef(new THREE.Vector3())
    const move = useRef({ forward: false, backward: false, left: false, right: false, sprint: false })
    const pointerLocked = useRef(false)
    const yaw = useRef(0)

    // Gestion des touches
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.code === "KeyW") move.current.forward = true
            if (e.code === "KeyS") move.current.backward = true
            if (e.code === "KeyA") move.current.left = true
            if (e.code === "KeyD") move.current.right = true
            if (e.code === "ShiftLeft" || e.code === "ShiftRight") move.current.sprint = true
        }
        const onKeyUp = (e: KeyboardEvent) => {
            if (e.code === "KeyW") move.current.forward = false
            if (e.code === "KeyS") move.current.backward = false
            if (e.code === "KeyA") move.current.left = false
            if (e.code === "KeyD") move.current.right = false
            if (e.code === "ShiftLeft" || e.code === "ShiftRight") move.current.sprint = false
        }
        window.addEventListener("keydown", onKeyDown)
        window.addEventListener("keyup", onKeyUp)
        return () => {
            window.removeEventListener("keydown", onKeyDown)
            window.removeEventListener("keyup", onKeyUp)
        }
    }, [])

    // Gestion du verrouillage du pointeur (souris)
    useEffect(() => {
        const onPointerLockChange = () => {
            pointerLocked.current = document.pointerLockElement !== null
        }
        document.addEventListener("pointerlockchange", onPointerLockChange)
        return () => document.removeEventListener("pointerlockchange", onPointerLockChange)
    }, [])

    // Rotation FPS fluide : yaw sur le corps, pitch sur la caméra
    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!pointerLocked.current) return
            yaw.current -= e.movementX * 0.002
            // Pas de pitch : la caméra reste à l'horizontale
        }
        window.addEventListener("mousemove", onMouseMove)
        return () => window.removeEventListener("mousemove", onMouseMove)
    }, [])

    // Clique pour activer le mode FPS
    useEffect(() => {
        const onClick = () => {
            if (!pointerLocked.current) {
                document.body.requestPointerLock()
            }
        }
        window.addEventListener("click", onClick)
        return () => window.removeEventListener("click", onClick)
    }, [])

    // Synchronisation du corps physique et de la caméra
    useFrame(() => {
        if (!rigidBodyRef.current) return
        direction.current.set(0, 0, 0)
        if (move.current.forward) direction.current.z -= 1
        if (move.current.backward) direction.current.z += 1
        if (move.current.left) direction.current.x -= 1
        if (move.current.right) direction.current.x += 1
        direction.current.normalize()
        // Appliquer la rotation de la caméra (yaw) à la direction
        const baseSpeed = 4
        const sprintSpeed = 10
        const speed = move.current.sprint ? sprintSpeed : baseSpeed
        const angle = yaw.current
        // Crée un vecteur direction dans l'espace local, puis le fait tourner selon le yaw
        const moveVec = new THREE.Vector3(direction.current.x, 0, direction.current.z)
        moveVec.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle)
        velocity.current = [moveVec.x * speed, 0, moveVec.z * speed]
        rigidBodyRef.current.setLinvel({ x: velocity.current[0], y: 0, z: velocity.current[2] }, true)
        // Synchronise la caméra sur la position du corps
        const pos = rigidBodyRef.current.translation()
        camera.position.set(pos.x, pos.y + 0.6, pos.z)
        camera.rotation.set(0, angle, 0)
    })

    // Début du chemin principal : x=0, z=-17 (clairière)
    return (
        <RigidBody ref={rigidBodyRef} type="dynamic" position={[0, 1.7, -17]} friction={0.8} restitution={0.1} linearDamping={0.9} angularDamping={0.9}>
            <CapsuleCollider args={[0.32, 1.2]} />
            <CameraPitch camera={camera} />
        </RigidBody>
    )
}
