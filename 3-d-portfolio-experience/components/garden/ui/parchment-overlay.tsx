"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useParchment } from "./parchment-context"

// Types
interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  challenges: string
  results: string
}

interface ParchmentContent {
  zone: string
  title: string
  content: string[]
  highlight?: string
  fullContent?: React.ReactNode
}

// Données
export const projects: Project[] = [
  // Suppression des projets factices
]

// Constantes de style réutilisables
const COLORS = {
  primary: "oklch(0.30 0.03 40)",
  secondary: "oklch(0.35 0.02 35)",
  tertiary: "oklch(0.32 0.03 40)",
  quaternary: "oklch(0.40 0.02 35)",
  accent: "oklch(0.42 0.08 350)",
  border: "rgba(139, 111, 71, 0.3)",
  borderDark: "rgba(139, 111, 71, 0.5)",
  badgeBg: "rgba(139, 111, 71, 0.15)",
} as const

// Composants utilitaires
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="font-semibold mb-2" style={{ color: COLORS.tertiary }}>
    {children}
  </p>
)

const TextContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`leading-relaxed ${className}`} style={{ color: COLORS.secondary }}>
    {children}
  </p>
)

const TechBadge = ({ tech }: { tech: string }) => (
  <span
    className="px-3 py-1 rounded-full text-sm font-medium"
    style={{ backgroundColor: COLORS.badgeBg, color: COLORS.secondary }}
  >
    {tech}
  </span>
)

const ProjectDetail = ({ title, content }: { title: string; content: string }) => (
  <div>
    <SectionTitle>{title}</SectionTitle>
    <p className="text-sm leading-relaxed" style={{ color: COLORS.secondary }}>
      {content}
    </p>
  </div>
)

const OrnamentalDivider = ({ position = "top" }: { position?: "top" | "bottom" }) => (
  <div className="flex items-center justify-center gap-3">
    <div className="h-px bg-accent/40 flex-1" />
    {position === "top" ? (
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-accent/60 rounded-full" />
        <div className="w-2 h-2 bg-primary/60 rounded-full" />
        <div className="w-2 h-2 bg-accent/60 rounded-full" />
      </div>
    ) : (
      <div className="w-3 h-3 border-2 border-accent/60 rotate-45" />
    )}
    <div className="h-px bg-accent/40 flex-1" />
  </div>
)

const CornerDecoration = ({ position }: { position: "tl" | "tr" | "bl" | "br" }) => {
  const baseClasses = "absolute w-6 h-6"
  const positionClasses = {
    tl: "top-2 left-2 border-t-2 border-l-2 rounded-tl-lg",
    tr: "top-2 right-2 border-t-2 border-r-2 rounded-tr-lg",
    bl: "bottom-2 left-2 border-b-2 border-l-2 rounded-bl-lg",
    br: "bottom-2 right-2 border-b-2 border-r-2 rounded-br-lg",
  }
  
  return (
    <div
      className={`${baseClasses} ${positionClasses[position]}`}
      style={{ borderColor: COLORS.borderDark }}
    />
  )
}

// Composants de contenu
const AboutContent = () => (
  <div className="space-y-4">
    <TextContent>
      Étudiant en informatique passionné par le développement full-stack...
    </TextContent>
  </div>
)

const ContactContent = () => (
  <div className="space-y-4">
    <TextContent>
      N'hésitez pas à me contacter pour toute opportunité...
    </TextContent>
    <div className="pt-6 border-t-2 border-dashed" style={{ borderColor: COLORS.border }}>
      <p className="text-sm italic text-center" style={{ color: COLORS.quaternary }}>
        Disponible pour des missions freelance et opportunités en CDI
      </p>
    </div>
  </div>
)


const HomeIframe = () => (
  <div className="w-full flex flex-col items-center">
    <iframe
      src="/test/accueil.html"
      title="Site d'accueil intégré"
      className="w-full rounded-2xl border border-gray-300 shadow-2xl bg-white"
      style={{ width: "90vw", height: "80vh", minHeight: 500, minWidth: 600, background: "#fff", fontSize: "1.2rem" }}
      allow="fullscreen"
    />
    <p className="mt-2 text-center text-base text-muted-foreground font-semibold">Site web intégré dans le parchemin</p>
  </div>
)

const parchmentData: ParchmentContent[] = [
  {
    zone: "home",
    title: "Bienvenue dans mon jardin zen",
    content: [],
    fullContent: <HomeIframe />,
    highlight: "Commencez votre exploration en vous déplaçant dans le jardin...",
  },
  // Suppression de la zone "projects" pour désactiver l'overlay Mes Projets
  {
    zone: "about",
    title: "À Propos de Moi",
    content: [],
    fullContent: <AboutContent />,
  },
  {
    zone: "contact",
    title: "Me Contacter",
    content: [],
    fullContent: <ContactContent />,
  },
]

// Composant principal
export function ParchmentOverlay(props: { currentZone?: string; projectId?: string; onClose?: () => void }) {
  const { currentZone, projectId, onClose } = props
  const parchmentCtx = useParchment()
  const zone = currentZone ?? parchmentCtx.parchment.zone
  const projId = projectId ?? parchmentCtx.parchment.projectId

  const [visible, setVisible] = useState(false)
  const [content, setContent] = useState<ParchmentContent | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    if (zone === "projects" && projId) {
      const project = projects.find((p) => p.id === projId)
      setSelectedProject(project ?? null)
      setContent(parchmentData.find((p) => p.zone === "projects") ?? null)
      setVisible(true)
    } else if (zone) {
      setContent(parchmentData.find((p) => p.zone === zone) ?? null)
      setSelectedProject(null)
      setVisible(true)
    } else {
      setVisible(false)
      setContent(null)
      setSelectedProject(null)
    }
  }, [zone, projId])

  if (!visible || !content) return null

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-40 w-[95vw] max-w-300 px-2">
      <div
        className="pointer-events-auto rounded-2xl p-4 md:p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 border-4 max-h-[85vh] overflow-y-auto"
        style={{
          background:
            "linear-gradient(135deg, rgba(250, 245, 235, 0.98) 0%, rgba(255, 250, 240, 0.95) 50%, rgba(250, 245, 235, 0.98) 100%)",
          borderColor: "rgba(139, 111, 71, 0.6)",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 2px 4px rgba(255, 255, 255, 0.5), inset 0 -2px 4px rgba(139, 111, 71, 0.2)",
        }}
      >
        {/* Decorative paper texture overlay */}
        <div
          className="absolute inset-0 opacity-20 rounded-2xl pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative">
          {onClose && (
            <button onClick={onClose} className="absolute top-2 right-2 z-10 bg-white/70 rounded-full p-1 shadow hover:bg-white">
              <X className="w-5 h-5" />
            </button>
          )}
          
          <div className="mb-6">
            <OrnamentalDivider position="top" />
          </div>

          <h3 className="text-3xl font-bold mb-6 text-center text-balance" style={{ color: COLORS.primary }}>
            {content.title}
          </h3>

          {selectedProject ? (
            <div className="space-y-4">
              <h4 className="font-bold text-2xl text-center" style={{ color: COLORS.primary }}>
                {selectedProject.title}
              </h4>
              <TextContent>{selectedProject.description}</TextContent>
              <div>
                <SectionTitle>Technologies utilisées</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech) => (
                    <TechBadge key={tech} tech={tech} />
                  ))}
                </div>
              </div>
              <ProjectDetail title="Défis techniques" content={selectedProject.challenges} />
              <ProjectDetail title="Résultats" content={selectedProject.results} />
            </div>
          ) : content.fullContent ? (
            content.fullContent
          ) : (
            <div className="space-y-4">
              {content.content.map((paragraph: string, i: number) => (
                <TextContent key={i} className="text-pretty">
                  {paragraph}
                </TextContent>
              ))}
            </div>
          )}

          {content.highlight && (
            <div className="mt-6 pt-6 border-t-2 border-dashed" style={{ borderColor: COLORS.border }}>
              <p className="text-center font-medium italic text-lg" style={{ color: COLORS.accent }}>
                {content.highlight}
              </p>
            </div>
          )}

          <div className="mt-6">
            <OrnamentalDivider position="bottom" />
          </div>
        </div>

        <CornerDecoration position="tl" />
        <CornerDecoration position="tr" />
        <CornerDecoration position="bl" />
        <CornerDecoration position="br" />
      </div>
    </div>
  )
}
