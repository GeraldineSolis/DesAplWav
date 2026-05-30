"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { useAppState, Project } from "@/components/AppState";

function ProjectDetailDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const { team } = useAppState();
  const members = team.filter((m) => project.members.includes(m.userId));
  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>{project.title}</DialogTitle>
        <DialogDescription>{project.description}</DialogDescription>
      </DialogHeader>
      <div className="space-y-3 py-2">
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline">{project.category}</Badge>
          <Badge variant="outline">{project.priority}</Badge>
          <Badge>{project.status}</Badge>
        </div>
        <div>
          <p className="text-sm font-medium mb-1">Progreso</p>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${project.progress}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{project.progress}%</p>
        </div>
        <div>
          <p className="text-sm font-medium mb-2">Miembros del equipo ({members.length})</p>
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin miembros asignados</p>
          ) : (
            <div className="space-y-1">
              {members.map((m) => (
                <div key={m.userId} className="flex items-center gap-2 text-sm">
                  <span className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                    {m.name[0]}
                  </span>
                  <span>{m.name}</span>
                  <span className="text-muted-foreground">— {m.role}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cerrar</Button>
      </DialogFooter>
    </DialogContent>
  );
}

function ProjectFormDialog({
  open, onOpenChange, editProject,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editProject?: Project | null;
}) {
  const { projects, setProjects, team } = useAppState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: editProject?.title ?? "",
    description: editProject?.description ?? "",
    category: editProject?.category ?? "",
    priority: editProject?.priority ?? "",
    status: editProject?.status ?? "Planificado",
    progress: editProject?.progress ?? 0,
    members: editProject?.members ?? [] as string[],
  });

  const toggleMember = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.includes(userId)
        ? prev.members.filter((id) => id !== userId)
        : [...prev.members, userId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.priority) {
      setError("Por favor completa los campos obligatorios (*).");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (editProject) {
        setProjects((prev) =>
          prev.map((p) => p.id === editProject.id ? { ...p, ...formData, team: formData.members.length } : p)
        );
      } else {
        const newProject: Project = {
          id: Date.now(),
          ...formData,
          team: formData.members.length,
        };
        setProjects((prev) => [...prev, newProject]);
      }
      setLoading(false);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>{editProject ? "Editar Proyecto" : "Crear Nuevo Proyecto"}</DialogTitle>
          <DialogDescription>Completa la información del proyecto.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error de validación</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-2">
            <Label htmlFor="title">Nombre del Proyecto <span className="text-red-500">*</span></Label>
            <Input id="title" placeholder="Mi Proyecto" value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Input id="description" placeholder="Breve descripción..." value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Categoría <span className="text-red-500">*</span></Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v ?? ""})}>
                <SelectTrigger><SelectValue placeholder="Categoría" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Desarrollo Web</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="design">Diseño</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Prioridad <span className="text-red-500">*</span></Label>
              <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v ?? "" })}>
                <SelectTrigger><SelectValue placeholder="Prioridad" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baja">Baja</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Estado</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v ?? "" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planificado">Planificado</SelectItem>
                  <SelectItem value="En progreso">En progreso</SelectItem>
                  <SelectItem value="En revisión">En revisión</SelectItem>
                  <SelectItem value="Completado">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="progress">Progreso ({formData.progress}%)</Label>
              <Input id="progress" type="number" min={0} max={100} value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Miembros del equipo</Label>
            <div className="border rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
              {team.map((member) => (
                <label key={member.userId} className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1 rounded">
                  <input type="checkbox" checked={formData.members.includes(member.userId)}
                    onChange={() => toggleMember(member.userId)}
                    className="accent-primary" />
                  <span className="text-sm font-medium">{member.name}</span>
                  <span className="text-xs text-muted-foreground">— {member.role}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancelar</Button>
          <Button type="submit" disabled={loading}>
            {loading ? <><Spinner className="mr-2" />{editProject ? "Guardando..." : "Creando..."}</> : editProject ? "Guardar cambios" : "Crear Proyecto"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

export function ProjectsSection() {
  const { projects, setProjects } = useAppState();
  const [formOpen, setFormOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [detailProject, setDetailProject] = useState<Project | null>(null);

  const handleDelete = (id: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const statusVariant = (s: string) =>
    s === "Completado" ? "default" : s === "En revisión" ? "secondary" : "outline";

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger>
            <Button onClick={() => setEditProject(null)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                <path d="M5 12h14" /><path d="M12 5v14" />
              </svg>
              Nuevo Proyecto
            </Button>
          </DialogTrigger>
          <ProjectFormDialog open={formOpen} onOpenChange={setFormOpen} editProject={editProject} />
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </div>
                <Badge variant={statusVariant(project.status)}>{project.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progreso</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    {project.members.length} miembros
                  </div>
                  <div className="flex gap-1">
                    {/* Detail */}
                    <Dialog>
                      <DialogTrigger>
                        <Button size="sm" variant="ghost" onClick={() => setDetailProject(project)}>Ver</Button>
                      </DialogTrigger>
                      {detailProject?.id === project.id && (
                        <ProjectDetailDialog project={detailProject} onClose={() => setDetailProject(null)} />
                      )}
                    </Dialog>
                    {/* Edit */}
                    <Dialog open={formOpen && editProject?.id === project.id} onOpenChange={(v) => { setFormOpen(v); if (!v) setEditProject(null); }}>
                      <DialogTrigger>
                        <Button size="sm" variant="outline" onClick={() => { setEditProject(project); setFormOpen(true); }}>Editar</Button>
                      </DialogTrigger>
                      {editProject?.id === project.id && (
                        <ProjectFormDialog open={formOpen} onOpenChange={(v) => { setFormOpen(v); if (!v) setEditProject(null); }} editProject={editProject} />
                      )}
                    </Dialog>
                    {/* Delete */}
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button size="sm" variant="destructive">Eliminar</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar proyecto?</AlertDialogTitle>
                          <AlertDialogDescription>Esta acción no se puede deshacer. El proyecto "{project.title}" será eliminado permanentemente.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(project.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ProjectForm() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
            <path d="M5 12h14" /><path d="M12 5v14" />
          </svg>
          Nuevo Proyecto
        </Button>
      </DialogTrigger>
      <ProjectFormDialog open={open} onOpenChange={setOpen} editProject={null} />
    </Dialog>
  );
}