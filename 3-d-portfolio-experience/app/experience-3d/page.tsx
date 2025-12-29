"use client"

import { Canvas } from "@react-three/fiber"
import { useState, useEffect } from "react"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { JapaneseGarden } from "@/components/garden/japanese-garden"
import { ParchmentOverlay } from "@/components/garden/ui/parchment-overlay"
import { ParchmentProvider } from "@/components/garden/ui/parchment-context"
import { InstructionsOverlay } from "@/components/garden/ui/instructions-overlay"
import { NavigationMenu } from "@/components/garden/ui/navigation-menu"
import { Minimap } from "@/components/garden/ui/minimap"

// Composant pour tracker la position de la caméra dans le Canvas
import { useThree } from "@react-three/fiber"

function CameraTracker({ onPositionChange }: { onPositionChange: (pos: { x: number, z: number }) => void }) {
	const { camera } = useThree()

	useEffect(() => {
		const interval = setInterval(() => {
			onPositionChange({ x: camera.position.x, z: camera.position.z })
		}, 100)
		return () => clearInterval(interval)
	}, [camera, onPositionChange])

	return null
}

export default function Experience3D() {
	const [cameraPos, setCameraPos] = useState<{ x: number, z: number }>({ x: 0, z: 0 })
	const [loading, setLoading] = useState(true)
	const { openParchment } = require("@/components/garden/ui/parchment-context")
	// Affiche le parchemin d'accueil au spawn
	useEffect(() => {
		const timer = setTimeout(() => setLoading(false), 2200)
		// Ouvre le parchemin d'accueil après le chargement
		setTimeout(() => {
			if (typeof window !== "undefined") {
				try {
					const parchmentCtx = require("@/components/garden/ui/parchment-context")
					if (parchmentCtx && parchmentCtx.openParchment) {
						parchmentCtx.openParchment("home")
					}
				} catch {}
			}
		}, 2300)
		return () => clearTimeout(timer)
	}, [])

	if (loading) {
		return (
			<div className="w-full h-screen bg-linear-to-b from-[#f5e9da] to-[#e6cfa7] flex items-center justify-center">
				<LoadingScreen />
				{/* Ajout décoratif japonisant */}
				<div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[2.5rem] font-serif text-[#b48a78] opacity-80 select-none pointer-events-none animate-fade-in">
					<span style={{ fontFamily: 'serif', letterSpacing: '0.2em' }}>ようこそ</span>
				</div>
				<div className="absolute top-10 right-10 text-[1.2rem] text-[#b48a78] opacity-60 select-none pointer-events-none animate-fade-in">
					Jardin Zen en chargement...
				</div>
			</div>
		)
	}

	return (
		<ParchmentProvider>
			<main className="w-full h-screen relative">
				<InstructionsOverlay />
				<NavigationMenu />
				<Minimap cameraPos={cameraPos} />
				<ParchmentOverlay />
				<Canvas
					key="main-canvas"
					camera={{ position: [0, 2, 8], fov: 60 }}
					gl={{ antialias: true, powerPreference: 'low-power' }}
					onCreated={({ gl }) => {
						console.log('[Canvas] Monté')
						gl.setPixelRatio(1)
						gl.shadowMap.enabled = false
					}}
				>
					<CameraTracker onPositionChange={setCameraPos} />
					<JapaneseGarden playerPosition={cameraPos} />
				</Canvas>
			</main>
		</ParchmentProvider>
	)
}
