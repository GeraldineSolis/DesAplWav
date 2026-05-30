"use client";

import { useState } from "react";
import {
    Table, TableBody, TableCaption, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Spinner } from "@/components/ui/spinner";
import { useAppState, TeamMember } from "@/components/AppState";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function MemberDialog({
    open, onOpenChange, editMember,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    editMember?: TeamMember | null;
}) {
    const { team, setTeam, projects } = useAppState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [calOpen, setCalOpen] = useState(false);

    const empty: Omit<TeamMember, "userId"> = {
        name: "", email: "", role: "", position: "",
        birthdate: "", phone: "", projectId: "", isActive: true,
    };
    const [form, setForm] = useState<Omit<TeamMember, "userId">>(
        editMember ? { ...editMember } : empty
    );
    const [birthdateDate, setBirthdateDate] = useState<Date | undefined>(
        editMember?.birthdate ? new Date(editMember.birthdate) : undefined
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.role || !form.position) {
            setError("Nombre, email, rol y posición son obligatorios.");
            return;
        }
        setError("");
        setLoading(true);
        setTimeout(() => {
            if (editMember) {
                setTeam((prev) =>
                    prev.map((m) => m.userId === editMember.userId ? { ...m, ...form } : m)
                );
            } else {
                const newMember: TeamMember = {
                    userId: `user-${Date.now()}`,
                    ...form,
                };
                setTeam((prev) => [...prev, newMember]);
            }
            setLoading(false);
            onOpenChange(false);
        }, 1200);
    };

    return (
        <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>{editMember ? "Editar Miembro" : "Agregar Miembro"}</DialogTitle>
                    <DialogDescription>Completa los campos del miembro del equipo.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertTitle>Error de validación</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label>Nombre <span className="text-red-500">*</span></Label>
                            <Input placeholder="Nombre completo" value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Email <span className="text-red-500">*</span></Label>
                            <Input type="email" placeholder="correo@ejemplo.com" value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label>Rol <span className="text-red-500">*</span></Label>
                            <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v ?? "" })}>
                                <SelectTrigger><SelectValue placeholder="Rol" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                                    <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                                    <SelectItem value="Full Stack Developer">Full Stack</SelectItem>
                                    <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                                    <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                                    <SelectItem value="Project Manager">Project Manager</SelectItem>
                                    <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Posición <span className="text-red-500">*</span></Label>
                            <Select value={form.position} onValueChange={(v) => setForm({ ...form, position: v ?? "" })}>
                                <SelectTrigger><SelectValue placeholder="Posición" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Junior">Junior</SelectItem>
                                    <SelectItem value="Mid">Mid</SelectItem>
                                    <SelectItem value="Senior">Senior</SelectItem>
                                    <SelectItem value="Lead">Lead</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label>Teléfono</Label>
                            <Input placeholder="+51 999 000 111" value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Fecha de nacimiento</Label>
                            <Popover open={calOpen} onOpenChange={setCalOpen}>
                                <PopoverTrigger>
                                    <Button type="button" variant="outline" className="w-full justify-start text-left font-normal">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                                        </svg>
                                        {birthdateDate ? format(birthdateDate, "dd/MM/yyyy") : "Seleccionar"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={birthdateDate}
                                        onSelect={(d) => {
                                            setBirthdateDate(d);
                                            setForm({ ...form, birthdate: d ? format(d, 'yyyy-MM-dd') : "" });
                                        }}
                                        locale={es}
                                        captionLayout="dropdown" 
                                        startMonth={new Date(1960, 0)} 
                                        endMonth={new Date(2005, 11)}   
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>Proyecto asignado</Label>
                        <Select value={form.projectId} onValueChange={(v) => setForm({ ...form, projectId: v ?? "" })}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar proyecto" /></SelectTrigger>
                            <SelectContent>
                                {projects.map((p) => (
                                    <SelectItem key={p.id} value={String(p.id)}>{p.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-3">
                        <Switch id="isActive" checked={form.isActive}
                            onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
                        <Label htmlFor="isActive">Miembro activo</Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancelar</Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? <><Spinner className="mr-2" />{editMember ? "Guardando..." : "Agregando..."}</> : editMember ? "Guardar" : "Agregar"}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}

export function TeamTable() {
    const { team, setTeam } = useAppState();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editMember, setEditMember] = useState<TeamMember | null>(null);

    const handleDelete = (userId: string) => {
        setTeam((prev) => prev.filter((m) => m.userId !== userId));
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Dialog open={dialogOpen && !editMember} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditMember(null); }}>
                    <DialogTrigger>
                        <Button onClick={() => setEditMember(null)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                                <path d="M5 12h14" /><path d="M12 5v14" />
                            </svg>
                            Agregar Miembro
                        </Button>
                    </DialogTrigger>
                    <MemberDialog open={dialogOpen && !editMember} onOpenChange={(v) => { setDialogOpen(v); }} editMember={null} />
                </Dialog>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableCaption>Lista de miembros del equipo</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Miembro</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Posición</TableHead>
                            <TableHead>Teléfono</TableHead>
                            <TableHead>Nacimiento</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {team.map((member) => (
                            <TableRow key={member.userId}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                                            {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                        </span>
                                        <div>
                                            <p className="font-medium text-sm">{member.name}</p>
                                            <p className="text-xs text-muted-foreground">{member.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm">{member.role}</TableCell>
                                <TableCell className="text-sm">{member.position}</TableCell>
                                <TableCell className="text-sm">{member.phone || "—"}</TableCell>
                                <TableCell className="text-sm">{member.birthdate || "—"}</TableCell>
                                <TableCell>
                                    <Badge variant={member.isActive ? "default" : "secondary"}>
                                        {member.isActive ? "Activo" : "Inactivo"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-1 justify-end">
                                        {/* Edit */}
                                        <Dialog open={dialogOpen && editMember?.userId === member.userId}
                                            onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditMember(null); }}>
                                            <DialogTrigger>
                                                <Button size="sm" variant="outline"
                                                    onClick={() => { setEditMember(member); setDialogOpen(true); }}>
                                                    Editar
                                                </Button>
                                            </DialogTrigger>
                                            {editMember?.userId === member.userId && (
                                                <MemberDialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditMember(null); }} editMember={editMember} />
                                            )}
                                        </Dialog>
                                        {/* Delete */}
                                        <AlertDialog>
                                            <AlertDialogTrigger>
                                                <Button size="sm" variant="destructive">Eliminar</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>¿Eliminar miembro?</AlertDialogTitle>
                                                    <AlertDialogDescription>Se eliminará a {member.name} del equipo permanentemente.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(member.userId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                        Eliminar
                                                    </AlertDialogAction>
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
        </div>
    );
}