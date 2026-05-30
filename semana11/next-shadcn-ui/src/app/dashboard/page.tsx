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

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab() {
  const { projects, team, tasks } = useAppState();

  const totalProjects = projects.length;
  const completedTasks = tasks.filter((t) => t.status === "Completado").length;
  const activeMembers = team.filter((m) => m.isActive).length;
  const inProgressTasks = tasks.filter((t) => t.status === "En progreso").length;

  const recentActivity = [
    ...tasks.filter((t) => t.status === "En progreso").slice(0, 2).map((t) => ({
      user: team.find((m) => m.userId === t.userId)?.name ?? "Usuario",
      action: "está trabajando en",
      task: t.description,
      time: "Reciente",
    })),
    ...tasks.filter((t) => t.status === "Completado").slice(0, 2).map((t) => ({
      user: team.find((m) => m.userId === t.userId)?.name ?? "Usuario",
      action: "completó",
      task: t.description,
      time: "Reciente",
    })),
  ].slice(0, 4);

  const stats = [
    { label: "Total Proyectos", value: totalProjects, sub: `${projects.filter(p => p.status === "En progreso").length} en progreso` },
    { label: "Tareas Completadas", value: completedTasks, sub: `${inProgressTasks} en progreso` },
    { label: "Tareas Pendientes", value: tasks.filter(t => t.status === "Pendiente").length, sub: `de ${tasks.length} totales` },
    { label: "Miembros Activos", value: activeMembers, sub: `de ${team.length} totales` },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Últimas actualizaciones de tus proyectos</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay actividad reciente.</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{a.user[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-none">{a.user}</p>
                    <p className="text-sm text-muted-foreground">
                      {a.action} <span className="font-medium">{a.task}</span>
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">{a.time}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Proyectos por estado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {["Planificado", "En progreso", "En revisión", "Completado"].map((status) => {
              const count = projects.filter((p) => p.status === status).length;
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={status === "Completado" ? "default" : status === "En revisión" ? "secondary" : "outline"}>
                      {status}
                    </Badge>
                  </div>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tareas por prioridad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(["Urgente", "Alta", "Media", "Baja"] as const).map((priority) => {
              const count = tasks.filter((t) => t.priority === priority).length;
              const variant = priority === "Urgente" ? "destructive" : priority === "Alta" ? "default" : priority === "Media" ? "secondary" : "outline";
              return (
                <div key={priority} className="flex items-center justify-between">
                  <Badge variant={variant}>{priority}</Badge>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard de Proyectos</h1>
          <p className="text-slate-600">Gestiona tus proyectos y tareas con shadcn/ui</p>
          <div className="pt-4">
            <ProjectForm />
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-fit">
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
      </div>
    </div>
  );
}