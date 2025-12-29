"use client"

import { useRef, useEffect } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import { PointerLockControls } from "@react-three/drei"
import * as THREE from "three"

export function FPSControls({ initialPosition = [-0.1, 1.7, -38] }: { initialPosition?: [number, number, number] }) {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)

  const movement = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    running: false,
    turbo: false,
    up: false,    // E
    down: false,  // C
  })

  const velocity = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3())

  useEffect(() => {
    // Positionne la caméra à l'entrée de l'allée au chargement
    camera.position.set(...initialPosition)
    const handleKeyDown = (e: KeyboardEvent) => {
      // AltLeft = turbo, ne pas confondre avec la touche E
      if (e.code === "AltLeft") {
        movement.current.turbo = true
        return
      }
      switch (e.code) {
        case "KeyW": // QWERTY avant
        case "KeyZ": // AZERTY avant
        case "ArrowUp":
          movement.current.forward = true
          break
        case "KeyS":
        case "ArrowDown":
          movement.current.backward = true
          break
        case "KeyA": // QWERTY gauche
        case "KeyQ": // AZERTY gauche
        case "ArrowLeft":
          movement.current.left = true
          break
        case "KeyD":
        case "ArrowRight":
          movement.current.right = true
          break
        case "KeyE": // Monter
          movement.current.up = true
          break
        case "KeyC": // Descendre
          movement.current.down = true
          break
        case "Escape":
          if (controlsRef.current) {
            controlsRef.current.unlock()
          }
          break
        case "ShiftLeft":
        case "ShiftRight":
          movement.current.running = true
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "AltLeft") {
        movement.current.turbo = false
        return
      }
      switch (e.code) {
        case "KeyW":
        case "KeyZ":
        case "ArrowUp":
          movement.current.forward = false
          break
        case "KeyS":
        case "ArrowDown":
          movement.current.backward = false
          break
        case "KeyA":
        case "KeyQ":
        case "ArrowLeft":
          movement.current.left = false
          break
        case "KeyD":
        case "ArrowRight":
          movement.current.right = false
          break
        case "KeyE":
          movement.current.up = false
          break
        case "KeyC":
          movement.current.down = false
          break
        case "ShiftLeft":
        case "ShiftRight":
          movement.current.running = false
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  useFrame((state, delta) => {
    if (!controlsRef.current) return

    let speed = 14.0 // vitesse normale
    if (movement.current.running) speed = 50.0 // vitesse de course

    velocity.current.x -= velocity.current.x * 10.0 * delta
    velocity.current.z -= velocity.current.z * 10.0 * delta
    velocity.current.y -= velocity.current.y * 10.0 * delta

    direction.current.z = Number(movement.current.forward) - Number(movement.current.backward)
    direction.current.x = Number(movement.current.right) - Number(movement.current.left)
    direction.current.y = Number(movement.current.up) - Number(movement.current.down)
    direction.current.normalize()

    if (movement.current.forward || movement.current.backward) {
      velocity.current.z -= direction.current.z * speed * delta
    }
    if (movement.current.left || movement.current.right) {
      velocity.current.x -= direction.current.x * speed * delta
    }
    if (movement.current.up || movement.current.down) {
      velocity.current.y -= direction.current.y * speed * delta
    }

    controlsRef.current.moveRight(-velocity.current.x * delta)
    controlsRef.current.moveForward(-velocity.current.z * delta)
    camera.position.y += velocity.current.y * delta

    // Boundary limits
    camera.position.x = Math.max(-40, Math.min(40, camera.position.x))
    camera.position.z = Math.max(-40, Math.min(40, camera.position.z))
    camera.position.y = Math.max(1.5, Math.min(20, camera.position.y))
  })

  return <PointerLockControls ref={controlsRef} />
}
