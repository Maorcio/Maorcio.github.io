export function Lighting({ night = false, sunPosition = [100, 20, 100] }: { night?: boolean, sunPosition?: [number, number, number] }) {
  if (!night) {
    // JOUR : seul le soleil éclaire, position synchronisée avec l'astre, couleur rouge
    return (
      <>
        <directionalLight
          position={sunPosition}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={100}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
          color="#e34234"
        />
        {/* Box de collision invisible pour le soleil */}
        <mesh position={sunPosition} visible={false}>
          <sphereGeometry args={[6, 16, 16]} />
        </mesh>
      </>
    );
  } else {
    // NUIT : la lune éclaire, position synchronisée avec la lune, couleur bleutée
    return (
      <>
        <directionalLight
          position={sunPosition}
          intensity={0.7}
          color="#bcd6ff"
          castShadow={false}
        />
        {/* Box de collision invisible pour la lune */}
        <mesh position={sunPosition} visible={false}>
          <sphereGeometry args={[6, 16, 16]} />
        </mesh>
      </>
    );
  }
}
