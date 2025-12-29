"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const menuItems = [
    { label: "Accueil", path: "/" },
    { label: "CV", path: "/cv" },
    { label: "À Propos", path: "/about" },
    { label: "Contact", path: "/contact" },
  ]

  return (
    <>
      {/* Menu button */}
      <div className="fixed top-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="default"
          size="lg"
          className="rounded-full shadow-lg backdrop-blur-sm bg-card/80 hover:bg-card border-2 border-primary"
        >
          <span className="text-lg font-medium">{isOpen ? "✕" : "☰"}</span>
        </Button>
      </div>

      {/* Menu overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-md z-40 flex items-center justify-center animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-card border-2 border-primary rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center text-balance">Navigation</h2>

            <nav className="space-y-3">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    router.push(item.path)
                    setIsOpen(false)
                  }}
                  className="w-full px-6 py-4 rounded-xl bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-all duration-200 text-left font-medium border border-border hover:border-primary hover:shadow-lg"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground text-center">
                Explorez le jardin en mode 3D ou utilisez ce menu pour une navigation rapide
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
