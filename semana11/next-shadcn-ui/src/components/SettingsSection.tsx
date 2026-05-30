"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAppState } from "@/components/AppState";

export function SettingsSection() {
  const { settings, setSettings } = useAppState();
  const [form, setForm] = useState({ ...settings });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    setTimeout(() => {
      setSettings(form);
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {saved && (
        <Alert className="border-primary/50 bg-primary/5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <AlertTitle className="text-primary">Configuración guardada</AlertTitle>
          <AlertDescription>Los cambios se han guardado correctamente.</AlertDescription>
        </Alert>
      )}

      {/* General */}
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
          <CardDescription>Configura el nombre y descripción de tu organización.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="orgName">Nombre de la organización</Label>
            <Input id="orgName" value={form.orgName}
              onChange={(e) => setForm({ ...form, orgName: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="orgDesc">Descripción</Label>
            <Input id="orgDesc" value={form.orgDescription}
              onChange={(e) => setForm({ ...form, orgDescription: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Zona horaria</Label>
              <Select value={form.timezone} onValueChange={(v) => setForm({ ...form, timezone: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Lima">America/Lima (UTC-5)</SelectItem>
                  <SelectItem value="America/Bogota">America/Bogotá (UTC-5)</SelectItem>
                  <SelectItem value="America/Mexico_City">America/México (UTC-6)</SelectItem>
                  <SelectItem value="America/Santiago">America/Santiago (UTC-3)</SelectItem>
                  <SelectItem value="America/Buenos_Aires">America/Buenos Aires (UTC-3)</SelectItem>
                  <SelectItem value="Europe/Madrid">Europe/Madrid (UTC+1)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Idioma</Label>
              <Select value={form.language} onValueChange={(v) => setForm({ ...form, language: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notificaciones</CardTitle>
          <CardDescription>Controla qué notificaciones deseas recibir.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "emailNotifications", label: "Notificaciones por email", desc: "Recibe alertas de actividad en tu correo." },
            { key: "pushNotifications", label: "Notificaciones push", desc: "Alertas en tiempo real en el navegador." },
            { key: "weeklyReport", label: "Reporte semanal", desc: "Resumen de actividad cada lunes." },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch
                checked={form[key as keyof typeof form] as boolean}
                onCheckedChange={(v) => setForm({ ...form, [key]: v })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Apariencia</CardTitle>
          <CardDescription>Personaliza la interfaz visual.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Tema</Label>
            <Select value={form.theme} onValueChange={(v) => setForm({ ...form, theme: v })}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Oscuro</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="min-w-[140px]">
          {loading ? <><Spinner className="mr-2" />Guardando...</> : "Guardar configuración"}
        </Button>
      </div>
    </form>
  );
}