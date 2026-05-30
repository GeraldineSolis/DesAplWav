"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ProjectForm, ProjectsSection } from "@/components/ProjectForm";
import { TeamTable } from "@/components/TeamTable";
import { TasksTable } from "@/components/TasksTable";
import { SettingsSection } from "@/components/SettingsSection";
import { useAppState } from "@/components/AppState";

// ─── Icons ────────────────────────────────────────────────────────────────────
const FolderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
  </svg>
);
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, color }: {
  label: string; value: number; sub: string;
  icon: React.ReactNode; color: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{sub}</p>
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            {icon}
          </div>
        </div>
      </CardContent>
      {/* accent bar */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${color.replace("bg-", "bg-").replace("/15", "")}`} />
    </Card>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab() {
  const { projects, team, tasks } = useAppState();

  const totalProjects = projects.length;
  const completedTasks = tasks.filter((t) => t.status === "Completado").length;
  const activeMembers = team.filter((m) => m.isActive).length;
  const inProgressTasks = tasks.filter((t) => t.status === "En progreso").length;
  const pendingTasks = tasks.filter((t) => t.status === "Pendiente").length;

  const recentActivity = [
    ...tasks.filter((t) => t.status === "En progreso").slice(0, 2).map((t) => ({
      user: team.find((m) => m.userId === t.userId)?.name ?? "Usuario",
      action: "está trabajando en",
      task: t.description,
      time: "Reciente",
      type: "progress",
    })),
    ...tasks.filter((t) => t.status === "Completado").slice(0, 2).map((t) => ({
      user: team.find((m) => m.userId === t.userId)?.name ?? "Usuario",
      action: "completó",
      task: t.description,
      time: "Reciente",
      type: "done",
    })),
  ].slice(0, 4);

  const stats = [
    { label: "Total Proyectos",    value: totalProjects,  sub: `${inProgressTasks} en progreso`,  icon: <FolderIcon />, color: "bg-blue-100/80 text-blue-600" },
    { label: "Tareas Completadas", value: completedTasks, sub: `${inProgressTasks} en progreso`,  icon: <CheckIcon />,  color: "bg-emerald-100/80 text-emerald-600" },
    { label: "Tareas Pendientes",  value: pendingTasks,   sub: `de ${tasks.length} totales`,      icon: <ClockIcon />,  color: "bg-amber-100/80 text-amber-600" },
    { label: "Miembros Activos",   value: activeMembers,  sub: `de ${team.length} totales`,       icon: <UsersIcon />,  color: "bg-violet-100/80 text-violet-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent activity — 2/3 width */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas actualizaciones de tus proyectos</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay actividad reciente.</p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                        {a.user.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{a.user}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {a.action} <span className="font-medium text-foreground">{a.task}</span>
                      </p>
                    </div>
                    <Badge variant={a.type === "done" ? "default" : "secondary"} className="shrink-0 text-xs">
                      {a.time}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick stats — 1/3 width */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Proyectos por estado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {["Planificado", "En progreso", "En revisión", "Completado"].map((status) => {
                const count = projects.filter((p) => p.status === status).length;
                const pct = projects.length ? Math.round((count / projects.length) * 100) : 0;
                const barColor = status === "Completado" ? "bg-emerald-500" : status === "En progreso" ? "bg-blue-500" : status === "En revisión" ? "bg-amber-500" : "bg-slate-300";
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-muted-foreground">{status}</span>
                      <span className="text-xs font-bold">{count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Tareas por prioridad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(["Urgente", "Alta", "Media", "Baja"] as const).map((priority) => {
                const count = tasks.filter((t) => t.priority === priority).length;
                const variant = priority === "Urgente" ? "destructive" : priority === "Alta" ? "default" : priority === "Media" ? "secondary" : "outline";
                return (
                  <div key={priority} className="flex items-center justify-between py-1">
                    <Badge variant={variant}>{priority}</Badge>
                    <span className="text-sm font-bold">{count}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-teal-50">
      {/* Top header bar */}
      <header className="border-b bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">Dashboard</h1>
              <p className="text-xs text-muted-foreground">Gestión de Proyectos</p>
            </div>
          </div>
          <ProjectForm />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="team">Equipo</TabsTrigger>
            <TabsTrigger value="tasks">Tareas</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <ProjectsSection />
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Miembros del Equipo</CardTitle>
                <CardDescription>Gestiona los miembros de tu equipo y sus roles.</CardDescription>
              </CardHeader>
              <CardContent>
                <TeamTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Tareas</CardTitle>
                <CardDescription>Administra todas las tareas de tus proyectos.</CardDescription>
              </CardHeader>
              <CardContent>
                <TasksTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <SettingsSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}