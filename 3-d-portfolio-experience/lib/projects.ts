// Liste des projets importés depuis le README
export interface Project {
  id: string;
  title: string;
  description: string;
  stack: string;
  role?: string;
  competences: string[];
  extra?: string;
}

export const projects: Project[] = [
  {
    id: "project-1",
    title: "Nuit de l'Info 2025 - Alternatives Open Source pour l'Enseignement Supérieur",
    description: "Hackathon national : développement d'un site web proposant des alternatives open source aux logiciels pour les universités. Architecture backend Node.js, endpoints API REST, intégration frontend-backend, gestion d'équipe et sprints courts.",
    stack: "Node.js, HTML/CSS, JavaScript",
    competences: [
      "Développement backend Node.js",
      "Architecture REST API",
      "Débogage rapide",
      "Travail d'équipe intensif",
      "Gestion du stress",
      "Priorisation des tâches"
    ],
    extra: "Application web fonctionnelle livrée dans les temps."
  },
  {
    id: "project-2",
    title: "Code Game Jam - Legendary Beats",
    description: "Game jam 48h : jeu 2D Unity où le joueur tire des notes de musique pour battre des boss musiciens et débloquer leur instrument légendaire.",
    stack: "Unity Engine, C#, Unity 2D",
    competences: [
      "Programmation C# orientée objet",
      "Unity 2D",
      "Proposition d'idée originale",
      "Travail collaboratif"
    ],
    extra: "Projet trop ambitieux pour 48h, mais gameplay original."
  },
  {
    id: "project-3",
    title: "Application de Gestion de Recettes",
    description: "Projet personnel pour gérer et organiser des recettes de cuisine. Architecture Next.js, gestion d'état React, design responsive.",
    stack: "Next.js, React, stockage JSON",
    competences: [
      "Architecture Next.js",
      "Gestion d'état React",
      "Design responsive",
      "Séparation des responsabilités"
    ],
    extra: "Timer multiple, gestion vocale, génération automatique de liste de courses, conversion d'unités."
  },
  {
    id: "project-4",
    title: "SaaS type Algolia",
    description: "Développement d'un SaaS de recherche et d'indexation inspiré d'Algolia. Frontend Next.js/React/TS, backend AdonisJS.",
    stack: "Next.js, React, TypeScript, Tailwind CSS, AdonisJS",
    competences: [
      "AdonisJS (ORM Lucid, validateurs, middleware)",
      "Architecture API REST",
      "Principes SOLID",
      "Séparation des responsabilités"
    ],
    extra: "Dashboard, architecture en couches, captures d'écran."
  }
];
