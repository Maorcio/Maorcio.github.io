"use client"

import { useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { RigidBody } from "@react-three/rapier"
import { ShojiDoor } from "./ShojiDoor"
import { Scroll } from "./Scroll"

type PagodaProps = {
	position?: [number, number, number]
	playerPosition?: { x: number, z: number }
}

export const PAGODA_CONFIG = {
	BASE_SIZE: 22,
	WALL_THICKNESS: 0.35,
	FLOOR_HEIGHT: 4.8,
	FLOORS_COUNT: 5,
	DOOR: { WIDTH: 4, HEIGHT: 3.8 },
	WINDOW: { WIDTH: 2.2, HEIGHT: 2.5 },
	COLORS: {
		FLOOR: "#f5ebe0",
		WALL: "#e8dcc8",
		ROOF_TILE: "#5a4a3a",
		ROOF_RIDGE: "#3a2a1a",
		WOOD_BEAM: "#6b5a4a",
		WOOD_TRIM: "#5a4a3a",
		ORNAMENT: "#B8860B",
		PILLAR: "#4a3728",
		SHOJI_PAPER: "#fff8e1",
		SHOJI_WOOD: "#8b7355",
		STONE_BASE: "#6b6b6b",
		BRACKET_RED: "#8B0000",
	},
	ROOF: {
		OVERHANG: 3.5,
		THICKNESS: 0.25,
	},
	PILLAR: { RADIUS: 0.28 },
} as const

// Base en pierre
function StoneBase({ size }: { size: number }) {
	return (
		<group position={[0, -0.4, 0]}>
			<RigidBody type="fixed" colliders="cuboid">
				<mesh position={[0, 0, 0]} receiveShadow castShadow>
					<boxGeometry args={[size + 2, 0.8, size + 2]} />
					<meshStandardMaterial color={PAGODA_CONFIG.COLORS.STONE_BASE} roughness={0.9} />
				</mesh>
			</RigidBody>

			{/* Marches d'accès */}
			{[0, 1, 2].map((i) => (
				<RigidBody key={i} type="fixed" colliders="cuboid">
					<mesh position={[0, -0.4 + i * 0.15, size / 2 + 1.2 - i * 0.3]} receiveShadow castShadow>
						<boxGeometry args={[6, 0.15, 0.8]} />
						<meshStandardMaterial color={PAGODA_CONFIG.COLORS.STONE_BASE} roughness={0.95} />
					</mesh>
				</RigidBody>
			))}

			{/* Bordure */}
			<mesh position={[0, 0.45, 0]} castShadow>
				<boxGeometry args={[size + 2.2, 0.1, size + 2.2]} />
				<meshStandardMaterial color="#5a5a5a" roughness={0.85} />
			</mesh>
		</group>
	)
}

// Pilier central
function CentralPillar({ height }: { height: number }) {
	return (
		<group position={[0, 0, 0]}>
			{/* Base en pierre */}
			<mesh position={[0, 0.15, 0]} castShadow>
				<cylinderGeometry args={[0.45, 0.5, 0.6, 12]} />
				<meshStandardMaterial color={PAGODA_CONFIG.COLORS.STONE_BASE} roughness={0.95} />
			</mesh>

			{/* Pilier en bois */}
			<mesh position={[0, height / 2 + 0.45, 0]} castShadow>
				<cylinderGeometry args={[
					PAGODA_CONFIG.PILLAR.RADIUS,
					PAGODA_CONFIG.PILLAR.RADIUS * 1.15,
					height,
					16
				]} />
				<meshStandardMaterial
					color={PAGODA_CONFIG.COLORS.PILLAR}
					roughness={0.75}
				/>
			</mesh>

			{/* Anneaux décoratifs */}
			{[0.25, 0.45, 0.65, 0.85].map((ratio) => (
				<mesh key={ratio} position={[0, height * ratio + 0.45, 0]} castShadow>
					<torusGeometry args={[PAGODA_CONFIG.PILLAR.RADIUS + 0.05, 0.03, 8, 24]} />
					<meshStandardMaterial
						color={PAGODA_CONFIG.COLORS.ORNAMENT}
						metalness={0.8}
						roughness={0.3}
					/>
				</mesh>
			))}
		</group>
	)
}

// Bracket dou-gong
function DougongBracket({
	position,
	rotation = [0, 0, 0],
	scale = 1
}: {
	position: [number, number, number]
	rotation?: [number, number, number]
	scale?: number
}) {
	return (
		<group position={position} rotation={rotation}>
			<mesh position={[0, 0, 0]} castShadow>
				<boxGeometry args={[0.35 * scale, 0.25 * scale, 0.35 * scale]} />
				<meshStandardMaterial color={PAGODA_CONFIG.COLORS.BRACKET_RED} roughness={0.7} />
			</mesh>

			<mesh position={[0, 0.2 * scale, 0]} castShadow>
				<boxGeometry args={[0.6 * scale, 0.15 * scale, 0.3 * scale]} />
				<meshStandardMaterial color={PAGODA_CONFIG.COLORS.WOOD_BEAM} roughness={0.75} />
			</mesh>

			<mesh position={[0, 0.4 * scale, 0]} castShadow>
				<boxGeometry args={[0.8 * scale, 0.15 * scale, 0.25 * scale]} />
				<meshStandardMaterial color={PAGODA_CONFIG.COLORS.BRACKET_RED} roughness={0.7} />
			</mesh>
		</group>
	)
}

// Pilier d'angle
function CornerPillar({ position, height }: { position: [number, number, number]; height: number }) {
	return (
		<group position={position}>
			{/* Base en pierre */}
			<mesh position={[0, 0.15, 0]} castShadow>
				<cylinderGeometry args={[
					PAGODA_CONFIG.PILLAR.RADIUS * 1.5,
					PAGODA_CONFIG.PILLAR.RADIUS * 1.7,
					0.3,
					12
				]} />
				<meshStandardMaterial color={PAGODA_CONFIG.COLORS.STONE_BASE} roughness={0.9} />
			</mesh>

			{/* Corps du pilier */}
			<mesh position={[0, height / 2 + 0.3, 0]} castShadow>
				<cylinderGeometry args={[
					PAGODA_CONFIG.PILLAR.RADIUS,
					PAGODA_CONFIG.PILLAR.RADIUS * 1.05,
					height,
					16
				]} />
				<meshStandardMaterial color={PAGODA_CONFIG.COLORS.PILLAR} roughness={0.75} />
			</mesh>

			{/* Chapiteau */}
			<mesh position={[0, height + 0.45, 0]} castShadow>
				<cylinderGeometry args={[
					PAGODA_CONFIG.PILLAR.RADIUS * 1.5,
					PAGODA_CONFIG.PILLAR.RADIUS,
					0.4,
					12
				]} />
				<meshStandardMaterial color={PAGODA_CONFIG.COLORS.WOOD_TRIM} roughness={0.8} />
			</mesh>

			{/* Bracket */}
			<DougongBracket
				position={[0, height + 0.75, 0]}
				scale={0.8}
			/>
		</group>
	)
}

// Fenêtre kumiko
function Window({ position, size }: { position: [number, number, number]; size: [number, number, number] }) {
	return (
		<group position={position}>
			{/* Cadre */}
			<mesh castShadow receiveShadow>
				<boxGeometry args={[size[0] + 0.1, size[1] + 0.1, 0.08]} />
				<meshStandardMaterial color={PAGODA_CONFIG.COLORS.WOOD_TRIM} roughness={0.7} />
			</mesh>

			{/* Papier washi */}
			<mesh position={[0, 0, 0.03]}>
				<boxGeometry args={[size[0], size[1], 0.02]} />
				<meshStandardMaterial
					color={PAGODA_CONFIG.COLORS.SHOJI_PAPER}
					roughness={0.5}
					transparent
					opacity={0.8}
				/>
			</mesh>

			{/* Grille horizontale */}
			{Array.from({ length: 4 }, (_, i) => (
				<mesh key={`h-${i}`} position={[0, -size[1] / 2 + (i + 1) * (size[1] / 5), 0.05]}>
					<boxGeometry args={[size[0] * 0.9, 0.03, 0.02]} />
					<meshStandardMaterial color={PAGODA_CONFIG.COLORS.SHOJI_WOOD} roughness={0.8} />
				</mesh>
			))}

			{/* Grille verticale */}
			{Array.from({ length: 3 }, (_, i) => (
				<mesh key={`v-${i}`} position={[-size[0] / 2 + (i + 1) * (size[0] / 4), 0, 0.05]}>
					<boxGeometry args={[0.03, size[1] * 0.9, 0.02]} />
					<meshStandardMaterial color={PAGODA_CONFIG.COLORS.SHOJI_WOOD} roughness={0.8} />
				</mesh>
			))}
		</group>
	)
}


// ShojiDoorTrigger lève l'état open au parent
// Dans Pagoda.tsx, remplace ShojiDoorTrigger par:

function ShojiDoorTrigger({ width, height, yBase, z, open, setOpen }: {
	width: number
	height: number
	yBase: number
	z: number
	open: boolean
	setOpen: (open: boolean) => void
}) {
	const { camera } = useThree()

	useFrame(() => {
		const dx = camera.position.x - 0
		const dy = (camera.position.y - (yBase + height / 2))
		const dz = camera.position.z - z
		const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
		setOpen(dist < width * 1.5)
	})

	// UNE SEULE porte shoji, pas 3 !
	return (
		<ShojiDoor
			open={open}
			width={width}
			height={height}
			yBase={yBase}
			z={z}
			COLORS={PAGODA_CONFIG.COLORS}
		/>
	)
}


// Mur
function Wall({
	position,
	size,
	hasDoor = false,
	hasWindows = false,
	windowsCount = 2,
}: {
	position: [number, number, number]
	size: [number, number, number]
	hasDoor?: boolean
	hasWindows?: boolean
	windowsCount?: number
}) {
	const [width, height, depth] = size

	if (hasDoor) {
		const doorWidth = PAGODA_CONFIG.DOOR.WIDTH
		const doorHeight = PAGODA_CONFIG.DOOR.HEIGHT
		// On élargit le "trou" central pour qu'il soit bien aligné avec la porte Shoji
		const openingWidth = doorWidth + 0.6 // marge de sécurité pour le passage du joueur
		const sideWidth = (width - openingWidth) / 2
		const baseY = position[1] - height / 2
		const linteauCentreY = baseY + doorHeight + (height - doorHeight) / 2

		return (
			<>
				{/* Mur gauche */}
				<RigidBody type="fixed" colliders="cuboid">
					<mesh position={[position[0] - openingWidth / 2 - sideWidth / 2, position[1], position[2]]} castShadow receiveShadow>
						<boxGeometry args={[sideWidth, height, depth]} />
						<meshStandardMaterial color={PAGODA_CONFIG.COLORS.WALL} roughness={0.85} />
					</mesh>
				</RigidBody>
				{/* Mur droit */}
				<RigidBody type="fixed" colliders="cuboid">
					<mesh position={[position[0] + openingWidth / 2 + sideWidth / 2, position[1], position[2]]} castShadow receiveShadow>
						<boxGeometry args={[sideWidth, height, depth]} />
						<meshStandardMaterial color={PAGODA_CONFIG.COLORS.WALL} roughness={0.85} />
					</mesh>
				</RigidBody>
				{/* Linteau au-dessus de la porte (haut du mur) */}
				<RigidBody type="fixed" colliders="cuboid">
					<mesh position={[position[0], linteauCentreY, position[2]]} castShadow receiveShadow>
						<boxGeometry args={[openingWidth, height - doorHeight, depth]} />
						<meshStandardMaterial color={PAGODA_CONFIG.COLORS.WALL} roughness={0.85} />
					</mesh>
				</RigidBody>
			</>
		)
	}

	return (
		<>
			<RigidBody type="fixed" colliders="cuboid">
				<mesh position={position} castShadow receiveShadow>
					<boxGeometry args={size} />
					<meshStandardMaterial color={PAGODA_CONFIG.COLORS.WALL} roughness={0.85} />
				</mesh>
			</RigidBody>

			{hasWindows && Array.from({ length: windowsCount }, (_, i) => {
				const spacing = width / (windowsCount + 1)
				const xOffset = -width / 2 + spacing * (i + 1)
				return (
					<Window
						key={i}
						position={[position[0] + xOffset, position[1], position[2] + depth / 2 + 0.05]}
						size={[PAGODA_CONFIG.WINDOW.WIDTH, PAGODA_CONFIG.WINDOW.HEIGHT, 0.1]}
					/>
				)
			})}
		</>
	)
}

// Toit
function Roof({ size, yPosition }: { size: number; yPosition: number }) {
	const roofSize = size + PAGODA_CONFIG.ROOF.OVERHANG

	return (
		<group position={[0, yPosition, 0]}>
			{/* Poutres de support */}
			{Array.from({ length: 8 }, (_, i) => {
				const angle = (i / 8) * Math.PI * 2
				const dist = roofSize / 2.5
				return (
					<mesh
						key={i}
						position={[Math.cos(angle) * dist, -0.2, Math.sin(angle) * dist]}
						rotation={[0, angle + Math.PI / 2, 0]}
						castShadow
					>
						<boxGeometry args={[0.25, 0.2, roofSize * 0.4]} />
						<meshStandardMaterial color={PAGODA_CONFIG.COLORS.WOOD_BEAM} roughness={0.8} />
					</mesh>
				)
			})}

			{/* Brackets dou-gong */}
			{Array.from({ length: 12 }, (_, i) => {
				const angle = (i / 12) * Math.PI * 2
				const dist = size / 2.3
				return (
					<DougongBracket
						key={i}
						position={[Math.cos(angle) * dist, -0.4, Math.sin(angle) * dist]}
						rotation={[0, angle, 0]}
						scale={0.9}
					/>
				)
			})}

			{/* Base du toit */}
			<mesh position={[0, 0.1, 0]} castShadow receiveShadow>
				<boxGeometry args={[roofSize + 0.3, 0.2, roofSize + 0.3]} />
				<meshStandardMaterial color={PAGODA_CONFIG.COLORS.ROOF_RIDGE} roughness={0.8} />
			</mesh>

			{/* Structure pyramidale */}
			<mesh position={[0, 0.8, 0]} castShadow rotation={[0, Math.PI / 4, 0]}>
				<coneGeometry args={[roofSize / 1.35, 1.4, 4]} />
				<meshStandardMaterial color={PAGODA_CONFIG.COLORS.ROOF_TILE} roughness={0.7} />
			</mesh>

			{/* Ornements d'angle */}
			{[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z], i) => (
				<mesh
					key={i}
					position={[x * roofSize / 2.1, 0.5, z * roofSize / 2.1]}
					rotation={[0, Math.atan2(z, x), 0]}
					castShadow
				>
					<boxGeometry args={[0.5, 0.2, 1.4]} />
					<meshStandardMaterial color={PAGODA_CONFIG.COLORS.ORNAMENT} metalness={0.6} roughness={0.3} />
				</mesh>
			))}

			{/* Faîtière */}
			<mesh position={[0, 1.9, 0]} castShadow>
				<boxGeometry args={[roofSize / 3, 0.15, roofSize / 3]} />
				<meshStandardMaterial color={PAGODA_CONFIG.COLORS.ROOF_RIDGE} roughness={0.7} />
			</mesh>
		</group>
	)
}

// Sorin
function Sorin({ height }: { height: number }) {
	return (
		<group position={[0, height, 0]}>
			{/* Base octogonale */}
			<mesh position={[0, 0.4, 0]} castShadow>
				<cylinderGeometry args={[0.7, 0.9, 0.7, 8]} />
				<meshStandardMaterial
					color={PAGODA_CONFIG.COLORS.ORNAMENT}
					metalness={0.8}
					roughness={0.25}
				/>
			</mesh>

			{/* Tige centrale */}
			<mesh position={[0, 2.5, 0]} castShadow>
				<cylinderGeometry args={[0.16, 0.22, 4.2, 20]} />
				<meshStandardMaterial
					color={PAGODA_CONFIG.COLORS.ORNAMENT}
					metalness={0.85}
					roughness={0.2}
				/>
			</mesh>

			{/* 9 anneaux */}
			{[0.9, 1.3, 1.7, 2.1, 2.5, 2.9, 3.3, 3.7, 4.1].map((y, i) => (
				<mesh key={i} position={[0, y, 0]} castShadow rotation={[0, i * Math.PI / 9, 0]}>
					<torusGeometry args={[0.65 - i * 0.05, 0.09, 14, 24]} />
					<meshStandardMaterial
						color={PAGODA_CONFIG.COLORS.ORNAMENT}
						metalness={0.85}
						roughness={0.2}
					/>
				</mesh>
			))}

			{/* Joyau hōju */}
			<mesh position={[0, 4.5, 0]} castShadow>
				<sphereGeometry args={[0.4, 24, 24]} />
				<meshStandardMaterial
					color={PAGODA_CONFIG.COLORS.ORNAMENT}
					metalness={0.9}
					roughness={0.1}
					emissive={PAGODA_CONFIG.COLORS.ORNAMENT}
					emissiveIntensity={0.5}
				/>
			</mesh>

			{/* Flammes suien */}
			{[0, 1, 2, 3].map((i) => {
				const angle = (i / 4) * Math.PI * 2
				return (
					<mesh
						key={i}
						position={[Math.cos(angle) * 0.35, 4.5, Math.sin(angle) * 0.35]}
						rotation={[0, angle, Math.PI / 6]}
						castShadow
					>
						<boxGeometry args={[0.08, 0.6, 0.02]} />
						<meshStandardMaterial
							color={PAGODA_CONFIG.COLORS.ORNAMENT}
							metalness={0.9}
							roughness={0.1}
						/>
					</mesh>
				)
			})}

			{/* Flamme finale */}
			<mesh position={[0, 5.1, 0]} castShadow rotation={[0, Math.PI / 8, 0]}>
				<coneGeometry args={[0.22, 0.7, 4]} />
				<meshStandardMaterial
					color="#FFD700"
					metalness={0.95}
					roughness={0.05}
					emissive="#FFD700"
					emissiveIntensity={0.6}
				/>
			</mesh>
		</group>
	)
}

// Étage
function Floor({
	floorNumber,
	baseSize = PAGODA_CONFIG.BASE_SIZE,
	floorHeight = PAGODA_CONFIG.FLOOR_HEIGHT,
	pagodaInteriorOpen = true,
	southOpen,
	setSouthOpen,
	northOpen,
	setNorthOpen
}: {
	floorNumber: number
	baseSize?: number
	floorHeight?: number
	pagodaInteriorOpen?: boolean
	southOpen?: boolean
	setSouthOpen?: (open: boolean) => void
	northOpen?: boolean
	setNorthOpen?: (open: boolean) => void
}) {
	const yOffset = floorNumber * floorHeight
	const scale = 1 - floorNumber * 0.13
	const currentSize = baseSize * scale
	const pillarInset = 0.9

	return (
		<group position={[0, yOffset, 0]}>
			{/* Murs et éléments extérieurs TOUJOURS visibles */}
			<Wall
				position={[0, floorHeight / 2 + 0.45, -currentSize / 2 + PAGODA_CONFIG.WALL_THICKNESS / 2]}
				size={[currentSize, floorHeight, PAGODA_CONFIG.WALL_THICKNESS]}
				hasDoor={floorNumber === 0}
			/>
			<Wall
				position={[0, floorHeight / 2 + 0.45, currentSize / 2 - PAGODA_CONFIG.WALL_THICKNESS / 2]}
				size={[currentSize, floorHeight, PAGODA_CONFIG.WALL_THICKNESS]}
				hasDoor={floorNumber === 0}
			/>
			<Wall
				position={[-currentSize / 2 + PAGODA_CONFIG.WALL_THICKNESS / 2, floorHeight / 2 + 0.45, 0]}
				size={[PAGODA_CONFIG.WALL_THICKNESS, floorHeight, currentSize]}
				hasWindows={floorNumber > 0}
				windowsCount={2}
			/>
			<Wall
				position={[currentSize / 2 - PAGODA_CONFIG.WALL_THICKNESS / 2, floorHeight / 2 + 0.45, 0]}
				size={[PAGODA_CONFIG.WALL_THICKNESS, floorHeight, currentSize]}
				hasWindows={floorNumber > 0}
				windowsCount={2}
			/>

			{/* Sol, piliers, etc. visibles seulement si l'intérieur est ouvert */}
			{pagodaInteriorOpen && (
				<>
					{floorNumber === 0 ? (
						<>
							{/* Sol côté gauche (hors ouverture sud/nord) */}
							<RigidBody type="fixed" colliders="cuboid">
								<mesh position={[-(PAGODA_CONFIG.DOOR.WIDTH / 2 + (currentSize - PAGODA_CONFIG.DOOR.WIDTH) / 4), 0.45, 0]} receiveShadow>
									<boxGeometry args={[(currentSize - PAGODA_CONFIG.DOOR.WIDTH) / 2, 0.15, currentSize]} />
									<meshStandardMaterial color={PAGODA_CONFIG.COLORS.FLOOR} roughness={0.7} />
								</mesh>
							</RigidBody>
							{/* Sol côté droit (hors ouverture sud/nord) */}
							<RigidBody type="fixed" colliders="cuboid">
								<mesh position={[(PAGODA_CONFIG.DOOR.WIDTH / 2 + (currentSize - PAGODA_CONFIG.DOOR.WIDTH) / 4), 0.45, 0]} receiveShadow>
									<boxGeometry args={[(currentSize - PAGODA_CONFIG.DOOR.WIDTH) / 2, 0.15, currentSize]} />
									<meshStandardMaterial color={PAGODA_CONFIG.COLORS.FLOOR} roughness={0.7} />
								</mesh>
							</RigidBody>
							{/* Sol au fond (nord), laisse un trou devant la porte nord */}
							<RigidBody type="fixed" colliders="cuboid">
								<mesh position={[0, 0.45, -(currentSize / 4)]} receiveShadow>
									<boxGeometry args={[PAGODA_CONFIG.DOOR.WIDTH, 0.15, currentSize / 2 - PAGODA_CONFIG.DOOR.WIDTH / 2]} />
									<meshStandardMaterial color={PAGODA_CONFIG.COLORS.FLOOR} roughness={0.7} />
								</mesh>
							</RigidBody>
							{/* Sol devant (sud), laisse un trou devant la porte sud */}
							<RigidBody type="fixed" colliders="cuboid">
								<mesh position={[0, 0.45, currentSize / 4]} receiveShadow>
									<boxGeometry args={[PAGODA_CONFIG.DOOR.WIDTH, 0.15, currentSize / 2 - PAGODA_CONFIG.DOOR.WIDTH / 2]} />
									<meshStandardMaterial color={PAGODA_CONFIG.COLORS.FLOOR} roughness={0.7} />
								</mesh>
							</RigidBody>
							{/* Plus de sol devant les portes nord/sud : accès libre */}
						</>
					) : (
						<RigidBody type="fixed" colliders="cuboid">
							<mesh position={[0, 0.45, 0]} receiveShadow>
								<boxGeometry args={[currentSize, 0.15, currentSize]} />
								<meshStandardMaterial color={PAGODA_CONFIG.COLORS.FLOOR} roughness={0.7} />
							</mesh>
						</RigidBody>
					)}

					{/* Bordure */}
					<mesh position={[0, 0.6, 0]} castShadow>
						<boxGeometry args={[currentSize + 0.3, 0.08, currentSize + 0.3]} />
						<meshStandardMaterial color={PAGODA_CONFIG.COLORS.WOOD_TRIM} roughness={0.75} />
					</mesh>

					{/* Piliers d'angle */}
					<CornerPillar position={[-currentSize / 2 + pillarInset, 0.45, -currentSize / 2 + pillarInset]} height={floorHeight - 0.9} />
					<CornerPillar position={[currentSize / 2 - pillarInset, 0.45, -currentSize / 2 + pillarInset]} height={floorHeight - 0.9} />
					<CornerPillar position={[-currentSize / 2 + pillarInset, 0.45, currentSize / 2 - pillarInset]} height={floorHeight - 0.9} />
					<CornerPillar position={[currentSize / 2 - pillarInset, 0.45, currentSize / 2 - pillarInset]} height={floorHeight - 0.9} />
				</>
			)}

			{/* ShojiDoorTriggers CORRIGÉ avec vérification TypeScript */}
			{floorNumber === 0 && southOpen !== undefined && northOpen !== undefined && setSouthOpen && setNorthOpen && (
				<>
					{/* Porte SUD - Centrée sur le mur sud */}
					<ShojiDoorTrigger
						width={PAGODA_CONFIG.DOOR.WIDTH}
						height={PAGODA_CONFIG.DOOR.HEIGHT}
						yBase={0.45}
						z={currentSize / 2 - PAGODA_CONFIG.WALL_THICKNESS / 2}
						open={southOpen}
						setOpen={setSouthOpen}
					/>

					{/* Porte NORD - Centrée sur le mur nord */}
					<ShojiDoorTrigger
						width={PAGODA_CONFIG.DOOR.WIDTH}
						height={PAGODA_CONFIG.DOOR.HEIGHT}
						yBase={0.45}
						z={-(currentSize / 2 - PAGODA_CONFIG.WALL_THICKNESS / 2)}
						open={northOpen}
						setOpen={setNorthOpen}
					/>
				</>
			)}



			<Roof size={currentSize} yPosition={floorHeight + 0.45} />
		</group>
	)
}

export function Pagoda({ position = [0, 0, 0], playerPosition }: PagodaProps) {
	const totalHeight = PAGODA_CONFIG.FLOORS_COUNT * PAGODA_CONFIG.FLOOR_HEIGHT
	const [southOpen, setSouthOpen] = useState(false)
	const [northOpen, setNorthOpen] = useState(false)
	const [scrollOpen, setScrollOpen] = useState<number | null>(null)
	// Détection joueur dans la pagode (distance au centre < 10)
	const pagodaCenter = { x: position[0], z: position[2] }
	const isPlayerInside = playerPosition
		? Math.hypot(playerPosition.x - pagodaCenter.x, playerPosition.z - pagodaCenter.z) < 10
		: false
	const interiorOpen = southOpen || northOpen || isPlayerInside

	// Position des parchemins à l'intérieur, sur le mur nord intérieur
	const scrollsPos: [number, number, number][] = [
		[0, 3.2, -PAGODA_CONFIG.BASE_SIZE / 2 + PAGODA_CONFIG.WALL_THICKNESS + 3.5],
		[1.1, 2.2, -PAGODA_CONFIG.BASE_SIZE / 2 + PAGODA_CONFIG.WALL_THICKNESS + 3.5],
		[-1.1, 2.2, -PAGODA_CONFIG.BASE_SIZE / 2 + PAGODA_CONFIG.WALL_THICKNESS + 3.5],
	]

	return (
		<group position={position}>
			<StoneBase size={PAGODA_CONFIG.BASE_SIZE} />
			{/* CentralPillar TOUJOURS visible */}
			<CentralPillar height={totalHeight} />

			{Array.from({ length: PAGODA_CONFIG.FLOORS_COUNT }, (_, i) => (
				<Floor
					key={i}
					floorNumber={i}
					pagodaInteriorOpen={interiorOpen}
					{...(i === 0
						? {
							southOpen,
							setSouthOpen,
							northOpen,
							setNorthOpen,
						}
						: {})}
				/>
			))}

			{/* Intérieur chargé seulement si interiorOpen */}
			{interiorOpen && <>
				{scrollsPos.map((pos, idx) => (
					<Scroll
						key={idx}
						position={pos}
						label={`Parchemin ${idx + 1}`}
						onOpen={() => setScrollOpen(idx)}
						isOpen={scrollOpen === idx}
					/>
				))}
				{scrollOpen !== null && (
					<group position={[0, 4.5, 0]}>
						<mesh>
							<planeGeometry args={[2.2, 1.2]} />
							<meshStandardMaterial color="#fff8e1" />
						</mesh>
						{/* Texte ou contenu du parchemin ici */}
					</group>
				)}
			</>}

			<Sorin height={totalHeight + 0.45} />
		</group>
	)
}
