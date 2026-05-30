"use client";

import React, { createContext, useContext, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  progress: number;
  team: number;
  members: string[];
  image?: string;
}

export interface TeamMember {
  userId: string;
  name: string;
  email: string;
  role: string;
  position: string;
  birthdate: string;
  phone: string;
  projectId: string;
  isActive: boolean;
}

export interface Task {
  id: number;
  description: string;
  projectId: string;
  status: "Pendiente" | "En progreso" | "Completado";
  priority: "Baja" | "Media" | "Alta" | "Urgente";
  userId: string;
  dateline: string;
}

export interface AppSettings {
  orgName: string;
  orgDescription: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReport: boolean;
  language: string;
  theme: string;
}

// ─── Initial Data ─────────────────────────────────────────────────────────────

const initialProjects: Project[] = [
  { id: 1, title: "E-commerce Platform", description: "Plataforma de comercio electrónico con Next.js", category: "web", priority: "Alta", status: "En progreso", progress: 65, team: 5, members: ["maria-001", "juan-002"] },
  { id: 2, title: "Mobile App", description: "Aplicación móvil con React Native", category: "mobile", priority: "Media", status: "En revisión", progress: 90, team: 3, members: ["ana-003"] },
  { id: 3, title: "Dashboard Analytics", description: "Panel de análisis con visualizaciones", category: "web", priority: "Baja", status: "Planificado", progress: 20, team: 4, members: [] },
  { id: 4, title: "API Gateway", description: "Microservicios con Node.js", category: "web", priority: "Urgente", status: "En progreso", progress: 45, team: 6, members: ["carlos-004", "laura-005"] },
  { id: 5, title: "Design System", description: "Librería de componentes reutilizables", category: "design", priority: "Media", status: "Completado", progress: 100, team: 2, members: ["ana-003"] },
  { id: 6, title: "Marketing Website", description: "Sitio web institucional", category: "marketing", priority: "Baja", status: "En progreso", progress: 75, team: 3, members: ["maria-001"] },
];

const initialTeam: TeamMember[] = [
  { userId: "maria-001", name: "María García", email: "maria@example.com", role: "Frontend Developer", position: "Senior", birthdate: "1992-03-15", phone: "+51 999 111 222", projectId: "1", isActive: true },
  { userId: "juan-002", name: "Juan Pérez", email: "juan@example.com", role: "Backend Developer", position: "Mid", birthdate: "1990-07-22", phone: "+51 999 333 444", projectId: "1", isActive: true },
  { userId: "ana-003", name: "Ana López", email: "ana@example.com", role: "UI/UX Designer", position: "Senior", birthdate: "1994-11-08", phone: "+51 999 555 666", projectId: "2", isActive: false },
  { userId: "carlos-004", name: "Carlos Ruiz", email: "carlos@example.com", role: "DevOps Engineer", position: "Senior", birthdate: "1988-05-30", phone: "+51 999 777 888", projectId: "4", isActive: true },
  { userId: "laura-005", name: "Laura Martínez", email: "laura@example.com", role: "Project Manager", position: "Lead", birthdate: "1991-09-14", phone: "+51 999 999 000", projectId: "4", isActive: true },
];

const initialTasks: Task[] = [
  { id: 1, description: "Implementar autenticación JWT", projectId: "1", status: "En progreso", priority: "Alta", userId: "maria-001", dateline: "2025-11-15" },
  { id: 2, description: "Diseñar pantalla de perfil", projectId: "2", status: "Pendiente", priority: "Media", userId: "ana-003", dateline: "2025-11-20" },
  { id: 3, description: "Configurar CI/CD pipeline", projectId: "4", status: "Completado", priority: "Alta", userId: "carlos-004", dateline: "2025-11-10" },
  { id: 4, description: "Optimizar queries SQL", projectId: "1", status: "En progreso", priority: "Urgente", userId: "juan-002", dateline: "2025-11-12" },
  { id: 5, description: "Documentar API endpoints", projectId: "4", status: "Pendiente", priority: "Baja", userId: "laura-005", dateline: "2025-11-25" },
  { id: 6, description: "Pruebas unitarias módulo login", projectId: "1", status: "Pendiente", priority: "Media", userId: "juan-002", dateline: "2025-11-18" },
  { id: 7, description: "Integrar pasarela de pagos", projectId: "1", status: "Pendiente", priority: "Urgente", userId: "maria-001", dateline: "2025-11-22" },
  { id: 8, description: "Animaciones onboarding", projectId: "2", status: "En progreso", priority: "Baja", userId: "ana-003", dateline: "2025-11-28" },
];

const initialSettings: AppSettings = {
  orgName: "Mi Organización",
  orgDescription: "Dashboard de gestión de proyectos y equipo",
  timezone: "America/Lima",
  emailNotifications: true,
  pushNotifications: false,
  weeklyReport: true,
  language: "es",
  theme: "light",
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextType {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  team: TeamMember[];
  setTeam: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);

  return (
    <AppContext.Provider value={{ projects, setProjects, team, setTeam, tasks, setTasks, settings, setSettings }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used inside AppProvider");
  return ctx;
}