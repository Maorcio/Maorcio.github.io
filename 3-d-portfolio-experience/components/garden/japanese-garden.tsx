"use client"
import TopDownMapView from "./TopDownMapView"
import { Environment, Sky } from "@react-three/drei"
import { Physics, RigidBody } from "@react-three/rapier"
import Ground from "./elements/ground"
import { Lighting } from "./elements/lighting"
import { Trees } from "./elements/trees"
import { Rocks } from "./elements/rocks"
import { Bridge } from "./elements/bridge"
import { PagodaGLTF } from "./elements/PagodaGLTF"
import { Lanterns } from "./elements/lanterns"
import { KoiPond } from "./elements/koi-pond"
import { Roof } from "./elements/roof"
import { EdoWall } from "./elements/edo-wall"
import { SakuraParticles } from "./effects/sakura-particles"
import { PlayerController } from "./controls/PlayerController"
import AstreLights from "./AstreLights"
import { ParchmentProvider, useParchment } from "./ui/parchment-context"
import { ParchmentOverlay } from "./ui/parchment-overlay"
import { Scroll } from "./elements/Scroll"
import { useEffect, useState } from "react"
import * as THREE from "three"
import Stats from "stats.js"
import { useThree, useFrame } from "@react-three/fiber"
import StonePath from "./StonePath"

// Composant Stats.js pour affichage live des perfs
function StatsPanel() {
	useEffect(() => {
		const stats = new Stats()
		stats.showPanel(0)
		document.body.appendChild(stats.dom)

		function animate() {
			stats.begin()
			stats.end()
			requestAnimationFrame(animate)
		}

		requestAnimationFrame(animate)

		return () => {
			document.body.removeChild(stats.dom)
		}
	}, [])

	return null
}

// Allée en pavés de pierre avec motif

function GardenScene({ playerPosition }: { playerPosition?: { x: number, z: number } }) {
	const { gl, camera } = useThree()
	const [night, setNight] = useState(false)
	const [transition, setTransition] = useState(0)
	const [scrollOpen, setScrollOpen] = useState(false)
	// Gestion touche P pour ouvrir/fermer le parchemin (toggle)
	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (e.key === "p" || e.key === "P") setScrollOpen((v) => !v)
		}
		window.addEventListener("keydown", onKeyDown)
		return () => window.removeEventListener("keydown", onKeyDown)
	}, [])
	// Position dynamique du parchemin (zoom quand ouvert)
	const scrollDistanceClosed = 3.5
	const scrollDistanceOpen = 0.01 // collé à la caméra pour effet plein écran
	const scrollHeight = 2.1 // centré verticalement
	const [scrollAnim, setScrollAnim] = useState(0) // 0 = fermé, 1 = ouvert
	const [scrollPos, setScrollPos] = useState<[number, number, number]>([0, scrollHeight, -scrollDistanceClosed])
	useEffect(() => {
		// Animation smooth du zoom
		setScrollAnim((prev) => {
			if (scrollOpen && prev < 1) return Math.min(prev + 0.08, 1)
			if (!scrollOpen && prev > 0) return Math.max(prev - 0.08, 0)
			return prev
		})
	}, [scrollOpen])
	useEffect(() => {
		// Met à jour la position du parchemin devant la caméra avec interpolation
		const updateScroll = () => {
			const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
			const dist = scrollDistanceClosed * (1 - scrollAnim) + scrollDistanceOpen * scrollAnim
			const pos = camera.position.clone().add(dir.multiplyScalar(dist))
			setScrollPos([pos.x, pos.y + 0.2, pos.z])
		}
		updateScroll()
		const id = setInterval(updateScroll, 50)
		return () => clearInterval(id)
	}, [camera, scrollAnim])
	// --- MURS INVISIBLES POUR LIMITER LA MAP ---
	// Dimensions de la zone (doivent englober tout le jardin)
	const groundSize = 100;
	const BOUND_SIZE = groundSize;
	const WALL_THICKNESS = 1.5;
	const WALL_HEIGHT = 8;

	useEffect(() => {
		console.log('[JapaneseGarden] Composant monté')
		const canvas = gl.domElement

		const onLost = (e: Event) => {
			e.preventDefault()
			console.error('[JapaneseGarden] Contexte WebGL perdu !')
			alert('Le contexte WebGL a été perdu. Rechargez la page ou réduisez la complexité de la scène.')
		}

		canvas.addEventListener('webglcontextlost', onLost, false)

		return () => {
			canvas.removeEventListener('webglcontextlost', onLost, false)
			console.log('[JapaneseGarden] Composant démonté')
		}
	}, [gl])

	// Toggle mode nuit avec la touche N
	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (e.key === "n" || e.key === "N") setNight((v) => !v)
		}
		window.addEventListener("keydown", onKeyDown)
		return () => window.removeEventListener("keydown", onKeyDown)
	}, [])

	// Calcul de la transition jour/nuit
	useFrame(() => {
		setTransition((prev) => {
			if (night) {
				return Math.min(prev + 0.005, 1)
			} else {
				return Math.max(prev - 0.005, 0)
			}
		})
	})

	// Trajectoire verticale des astres (beaucoup plus haut, toujours positif)
	const astreX = 0
	const astreZ = 18
	const tSun = Math.min(transition, 0.5) * 2 // 0 (jour) à 1 (coucher)
	const tMoon = Math.max((transition - 0.5), 0) * 2 // 0 (lever) à 1 (nuit)
	// Soleil : de 60 (zénith) à 40 (coucher)
	const sunY = 60 - 20 * tSun
	// Lune : de 40 (lever) à 60 (zénith)
	const moonY = 40 + 20 * tMoon

	const sunPosition: [number, number, number] = [astreX, sunY, astreZ]
	const moonPosition: [number, number, number] = [astreX, moonY, astreZ]

	const starColor = transition < 0.5
		? new THREE.Color().lerpColors(new THREE.Color("#e34234"), new THREE.Color("#e0eaff"), transition * 2)
		: new THREE.Color().lerpColors(new THREE.Color("#e0eaff"), new THREE.Color("#e0eaff"), (transition - 0.5) * 2)

	const starRadius = 5 * (1 - transition) + 4.5 * transition

	let inclination = 0.6 * (1 - transition) + 0.1 * transition
	let azimuth = 0.25 * (1 - transition) + 0.5 * transition
	let mieCoefficient = 0.005 * (1 - transition) + 0.01 * transition
	let mieDirectionalG = 0.8 * (1 - transition) + 0.99 * transition
	let rayleigh = 0.5 * (1 - transition) + 0.1 * transition
	let turbidity = 2 * (1 - transition) + 1.5 * transition
	let envPreset: "night" | "sunset" = transition < 0.5 ? "sunset" : "night"

	if (transition > 0.7) {
		rayleigh = 0.05
		turbidity = 0.7
		mieCoefficient = 0.01
		mieDirectionalG = 0.999
		envPreset = "night"
		if (typeof window !== "undefined") {
			document.body.style.background = "#0a0c18"
		}
	} else if ((transition > 0.42 && transition < 0.58) || transition < 0.08 || transition > 0.92) {
		rayleigh = 1.2
		turbidity = 5
		mieCoefficient = 0.04
		mieDirectionalG = 0.99
		envPreset = "sunset"
		if (typeof window !== "undefined") {
			document.body.style.background = "#ffb36b"
		}
	} else {
		if (typeof window !== "undefined") {
			document.body.style.background = "#b3d6ff"
		}
	}



	return (
		<>
			<StatsPanel />
			{/* Vue du haut de la map (minimap ou top-down) */}
			<TopDownMapView />
			<Physics gravity={[0, -9.81, 0]}>
				{/* Murs physiques invisibles pour empêcher de sortir de la map */}
				<RigidBody type="fixed" colliders="cuboid">
					{/* Mur Nord */}
					<mesh position={[0, WALL_HEIGHT / 2, -BOUND_SIZE / 2]} visible={false}>
						<boxGeometry args={[BOUND_SIZE, WALL_HEIGHT, WALL_THICKNESS]} />
						<meshStandardMaterial transparent opacity={0} />
					</mesh>
					{/* Mur Sud */}
					<mesh position={[0, WALL_HEIGHT / 2, BOUND_SIZE / 2]} visible={false}>
						<boxGeometry args={[BOUND_SIZE, WALL_HEIGHT, WALL_THICKNESS]} />
						<meshStandardMaterial transparent opacity={0} />
					</mesh>
					{/* Mur Ouest */}
					<mesh position={[-BOUND_SIZE / 2, WALL_HEIGHT / 2, 0]} visible={false}>
						<boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, BOUND_SIZE]} />
						<meshStandardMaterial transparent opacity={0} />
					</mesh>
					{/* Mur Est */}
					<mesh position={[BOUND_SIZE / 2, WALL_HEIGHT / 2, 0]} visible={false}>
						<boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, BOUND_SIZE]} />
						<meshStandardMaterial transparent opacity={0} />
					</mesh>
				</RigidBody>
				{/* Lumières synchronisées avec les astres */}
				{/** @ts-ignore */}
				<AstreLights sunPosition={sunPosition} moonPosition={moonPosition} transition={transition} />
				<Lighting
					night={transition > 0.5}
					sunPosition={transition < 0.5 ? sunPosition : moonPosition}
				/>
				<Sky
					sunPosition={transition < 0.5 ? sunPosition : moonPosition}
					inclination={inclination}
					azimuth={azimuth}
					mieCoefficient={mieCoefficient}
					mieDirectionalG={mieDirectionalG}
					rayleigh={rayleigh}
					turbidity={transition < 0.5 ? 2 : 1.2}
				/>
				<Environment preset={envPreset} />

				{/* Astre dans le ciel animé : mesh affiché seulement si Y > 0 */}
				{transition < 0.5
					? sunPosition[1] > 0 && (
							<mesh position={sunPosition}>
								<sphereGeometry args={[starRadius, 32, 32]} />
								<meshStandardMaterial 
									color={starColor}
									emissive="#e34234"
									emissiveIntensity={2.2}
									metalness={0.7}
									roughness={0.15}
								/>
							</mesh>
						)
					: moonPosition[1] > 0 && (
							<mesh position={moonPosition}>
								<sphereGeometry args={[starRadius * 1.1, 32, 32]} />
								<meshStandardMaterial 
									color="#e0eaff"
									emissive="#e0eaff"
									emissiveIntensity={1.7}
									metalness={0.6}
									roughness={0.25}
								/>
							</mesh>
						)
				}

				{/* Contrôleur FPS du joueur : déplacement + vue (désactivé si parchemin ouvert) */}
				{!scrollOpen && <PlayerController />}

				{/* Parchemin 3D devant le joueur au spawn (toggle avec P) */}
				<Scroll
					position={scrollPos}
					label={"Parchemin"}
					onOpen={() => setScrollOpen(true)}
					isOpen={scrollOpen}
				/>

				{/* Murailles extérieures supprimées selon la demande */}

				<Ground />
				<StonePath />

				<RigidBody type="fixed" colliders="cuboid">
					<PagodaGLTF position={[0, 0, 7]} scale={[10, 10, 10]} />
				</RigidBody>
				<RigidBody type="fixed" colliders="cuboid">
					<Trees />
				</RigidBody>
				<RigidBody type="fixed" colliders="cuboid">
					<Rocks />
				</RigidBody>

				<Bridge position={[0, 0, 13]} />
				<Lanterns night={transition > 0.5} />
				<KoiPond position={[0, -2, 30]} rotation={[0, Math.PI, 0]} />
				<Roof position={[0, 5, 0]} scale={[2, 2, 2]} />
				<SakuraParticles />
			</Physics>

		</>
	)
}


export function JapaneseGarden({ playerPosition }: { playerPosition?: { x: number, z: number } }) {
	return <GardenScene playerPosition={playerPosition} />
}

export default JapaneseGarden
