"use client";

import { useState } from "react";
import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Pagination, PaginationContent, PaginationEllipsis,
  PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import { Spinner } from "@/components/ui/spinner";
import { useAppState, Task } from "@/components/AppState";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ITEMS_PER_PAGE = 5;

// ─── Task Form Dialog ─────────────────────────────────────────────────────────
function TaskDialog({
  open, onOpenChange, editTask,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editTask?: Task | null;
}) {
  const { tasks, setTasks, projects, team } = useAppState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [calOpen, setCalOpen] = useState(false);

  const empty = {
    description: "",
    projectId: "",
    status: "Pendiente" as Task["status"],
    priority: "Media" as Task["priority"],
    userId: "",
    dateline: "",
  };
  const [form, setForm] = useState(editTask ? { ...editTask } : empty);
  const [datelineDate, setDatelineDate] = useState<Date | undefined>(
    editTask?.dateline ? new Date(editTask.dateline) : undefined
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.projectId || !form.userId) {
      setError("Descripción, proyecto y responsable son obligatorios.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (editTask) {
        setTasks((prev) => prev.map((t) => t.id === editTask.id ? { ...t, ...form } : t));
      } else {
        setTasks((prev) => [...prev, { id: Date.now(), ...form }]);
      }
      setLoading(false);
      onOpenChange(false);
    }, 1200);
  };

  return (
    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>{editTask ? "Editar Tarea" : "Nueva Tarea"}</DialogTitle>
          <DialogDescription>Completa los datos de la tarea.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error de validación</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-2">
            <Label>Descripción <span className="text-red-500">*</span></Label>
            <Input placeholder="Describe la tarea..." value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Proyecto <span className="text-red-500">*</span></Label>
              <Select value={form.projectId} onValueChange={(v) => setForm({ ...form, projectId: v ?? "" })}>
                <SelectTrigger><SelectValue placeholder="Proyecto" /></SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Responsable <span className="text-red-500">*</span></Label>
              <Select value={form.userId} onValueChange={(v) => setForm({ ...form, userId: v ?? "" })}>
                <SelectTrigger><SelectValue placeholder="Miembro" /></SelectTrigger>
                <SelectContent>
                  {team.map((m) => (
                    <SelectItem key={m.userId} value={m.userId}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Estado</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v ?? "" as Task["status"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En progreso">En progreso</SelectItem>
                  <SelectItem value="Completado">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Prioridad</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v ?? "" as Task["priority"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baja">Baja</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Fecha límite (dateline)</Label>
            <Popover open={calOpen} onOpenChange={setCalOpen}>
              <PopoverTrigger>
                <Button type="button" variant="outline" className="w-full justify-start text-left font-normal">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                  {datelineDate ? format(datelineDate, "dd/MM/yyyy") : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={datelineDate}
                  onSelect={(d) => { setDatelineDate(d); setForm({ ...form, dateline: d ? format(d, "yyyy-MM-dd") : "" }); setCalOpen(false); }}
                  locale={es} />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancelar</Button>
          <Button type="submit" disabled={loading}>
            {loading ? <><Spinner className="mr-2" />{editTask ? "Guardando..." : "Creando..."}</> : editTask ? "Guardar" : "Crear Tarea"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

// ─── Badge helpers ────────────────────────────────────────────────────────────
const statusVariant = (s: string) =>
  s === "Completado" ? "default" : s === "En progreso" ? "secondary" : "outline";

const priorityVariant = (p: string) =>
  p === "Urgente" ? "destructive" : p === "Alta" ? "default" : p === "Media" ? "secondary" : "outline";

// ─── Main Export ──────────────────────────────────────────────────────────────
export function TasksTable() {
  const { tasks, setTasks, projects, team } = useAppState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);
  const paginated = tasks.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleDelete = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (paginated.length === 1 && page > 1) setPage(page - 1);
  };

  const getProjectName = (id: string) => projects.find((p) => String(p.id) === id)?.title ?? id;
  const getMemberName = (id: string) => team.find((m) => m.userId === id)?.name ?? id;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen && !editTask} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditTask(null); }}>
          <DialogTrigger>
            <Button onClick={() => setEditTask(null)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                <path d="M5 12h14" /><path d="M12 5v14" />
              </svg>
              Nueva Tarea
            </Button>
          </DialogTrigger>
          <TaskDialog open={dialogOpen && !editTask} onOpenChange={setDialogOpen} editTask={null} />
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>Lista de tareas — página {page} de {totalPages}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"><Checkbox /></TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Fecha límite</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((task) => (
              <TableRow key={task.id}>
                <TableCell><Checkbox /></TableCell>
                <TableCell className="font-medium max-w-[180px] truncate">{task.description}</TableCell>
                <TableCell className="text-sm">{getProjectName(task.projectId)}</TableCell>
                <TableCell><Badge variant={statusVariant(task.status)}>{task.status}</Badge></TableCell>
                <TableCell><Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge></TableCell>
                <TableCell className="text-sm">{getMemberName(task.userId)}</TableCell>
                <TableCell className="text-sm">{task.dateline || "—"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    {/* Edit */}
                    <Dialog open={dialogOpen && editTask?.id === task.id}
                      onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditTask(null); }}>
                      <DialogTrigger>
                        <Button size="sm" variant="outline"
                          onClick={() => { setEditTask(task); setDialogOpen(true); }}>
                          Editar
                        </Button>
                      </DialogTrigger>
                      {editTask?.id === task.id && (
                        <TaskDialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditTask(null); }} editTask={editTask} />
                      )}
                    </Dialog>
                    {/* Delete */}
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button size="sm" variant="destructive">Eliminar</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar tarea?</AlertDialogTitle>
                          <AlertDialogDescription>Se eliminará "{task.description}" permanentemente.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(task.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1); }}
                className={page === 1 ? "pointer-events-none opacity-50" : ""} />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink href="#" isActive={page === i + 1}
                  onClick={(e) => { e.preventDefault(); setPage(i + 1); }}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (page < totalPages) setPage(page + 1); }}
                className={page === totalPages ? "pointer-events-none opacity-50" : ""} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}