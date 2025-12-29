"use client"


export function Minimap({ cameraPos }: { cameraPos: { x: number, z: number } }) {
  // Map coordinates to minimap (scale: -40 to 40 world units to 0 to 100% minimap)
  const mapX = ((cameraPos.x + 40) / 80) * 100
  const mapZ = ((cameraPos.z + 40) / 80) * 100

  return (
    <div className="fixed bottom-8 right-8 z-40 pointer-events-none">
      <div
        className="w-48 h-48 bg-card/90 backdrop-blur-sm border-2 border-primary rounded-2xl p-3 shadow-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(250, 245, 235, 0.95) 0%, rgba(255, 250, 240, 0.9) 100%)",
        }}
      >
        <div className="w-full h-full relative rounded-xl overflow-hidden" style={{ background: "#c4b5a0" }}>
          {/* Garden elements on minimap */}
          {/* Pagoda (center) */}
          <div
            className="absolute w-3 h-3 bg-accent rounded-sm transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: "50%", top: "50%" }}
          />

          {/* Bridge */}
          <div
            className="absolute w-6 h-2 bg-secondary rounded-sm transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: "50%", top: "20%" }}
          />

          {/* Koi Pond */}
          <div
            className="absolute w-4 h-4 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: "50%", top: "75%" }}
          />

          {/* Lanterns */}
          <div
            className="absolute w-1.5 h-1.5 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: "25%", top: "58%" }}
          />
          <div
            className="absolute w-1.5 h-1.5 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: "75%", top: "58%" }}
          />
          <div
            className="absolute w-1.5 h-1.5 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: "35%", top: "15%" }}
          />
          <div
            className="absolute w-1.5 h-1.5 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: "65%", top: "15%" }}
          />

          {/* Player position */}
          <div
            className="absolute w-3 h-3 bg-red-500 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 shadow-lg animate-pulse"
            style={{ left: `${mapX}%`, top: `${mapZ}%` }}
          />
        </div>

        <p className="text-xs text-center mt-2 font-medium" style={{ color: "oklch(0.35 0.02 35)" }}>
          Carte du jardin
        </p>
      </div>
    </div>
  )
}
