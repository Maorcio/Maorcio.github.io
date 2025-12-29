"use client"

import { useState, useEffect, useCallback } from "react"

export function InstructionsOverlay() {
  const [visible, setVisible] = useState(true)

  const handleClick = useCallback(() => setVisible(false), [])

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => {
      setVisible(false)
    }, 8000)
    document.addEventListener("click", handleClick, { once: true })
    return () => {
      clearTimeout(timer)
      document.removeEventListener("click", handleClick)
    }
  }, [visible, handleClick])

  if (!visible) return null

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-40">
      <div className="pointer-events-auto bg-card/90 backdrop-blur-md border border-border rounded-2xl p-8 max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-700">
        <h2 className="text-3xl font-bold text-foreground mb-6 text-center text-balance">Jardin Zen Interactif</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          {/* Déplacement */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
              <span className="text-primary font-bold">⌨️</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Déplacement</p>
              <p className="text-sm">Utilisez WASD ou les flèches pour vous déplacer</p>
            </div>
          </div>
          {/* Vue */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
              <span className="text-primary font-bold">🖱️</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Vue</p>
              <p className="text-sm">Cliquez pour activer la souris et regarder autour de vous</p>
            </div>
          </div>
          {/* Interaction */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
              <span className="text-primary font-bold">👆</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Interaction</p>
              <p className="text-sm">Cliquez sur les éléments pour naviguer vers les différentes sections</p>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground italic">Cliquez n'importe où pour commencer...</p>
        </div>
      </div>
    </div>
  )
}
