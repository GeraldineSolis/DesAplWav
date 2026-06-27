# 🚀 Quick Start - ProductStore Optimizado

## ⚡ Inicio Rápido (RECOMENDADO)

### Windows (PowerShell o CMD)

```bash
# Opción 1: Usar script automatizado (RECOMENDADO)
.\dev.bat fast

# Opción 2: Manual - Terminal 1 (Backend)
cd backend-marketplace
npm run dev:fast

# Opción 2: Manual - Terminal 2 (Frontend)
cd frontend-marketplace
npm run dev
```

### macOS / Linux

```bash
# Opción 1: Manual - Terminal 1 (Backend)
cd backend-marketplace
npm run dev:fast

# Opción 1: Manual - Terminal 2 (Frontend)
cd frontend-marketplace
npm run dev
```

---

## 📊 Rendimiento Esperado

Después de las optimizaciones:

✅ **Backend inicia en ~1s** (antes ~3s)  
✅ **Frontend compila en ~2s** (antes ~4s)  
✅ **RAM: ~400MB total** (antes ~800MB)  
✅ **CPU: ~5% en reposo** (antes ~15%)  
✅ **Sin calentamiento excesivo** de la PC  

---

## 🔧 Opciones de Inicio

### 1️⃣ **FAST** (Recomendado para PC lenta)
```bash
npm run dev:fast      # Backend sin vigilancia
npm run dev           # Frontend normal
```
- ✅ Mínimo consumo RAM
- ✅ PC no se calienta
- ✅ Los cambios en código se reflejan (necesitas recargar browser)
- ❌ Necesitas reiniciar backend si cambias código

### 2️⃣ **TURBO** (Experimental, más rápido)
```bash
npm run dev           # Backend con nodemon
npm run dev:turbo     # Frontend con Turbopack
```
- ✅ Cambios en vivo funcionan
- ✅ Compilación muy rápida (experimental)
- ⚠️ Turbopack aún está en desarrollo
- ⚠️ Consumo RAM moderado

### 3️⃣ **FULL** (Desarrollo completo)
```bash
npm run dev           # Backend con vigilancia
npm run dev           # Frontend normal
```
- ✅ Todas las características activadas
- ✅ Hot reload funcionando
- ❌ Mayor consumo de recursos
- ❌ PC se calienta más

---

## 📋 Pre-requisitos

Verifica que tienes esto antes de empezar:

```bash
# Node.js versión 18.x o superior
node --version

# npm versión 10.x o superior
npm --version

# MySQL o Railway DB conectada (verificar .env)
```

---

## ✅ Setup Inicial (primera vez)

```bash
# 1. Backend
cd backend-marketplace
npm install                    # Instala dependencias
cp .env.example .env          # Crea .env
# Edita .env con tus credenciales de BD

# 2. Frontend
cd ../frontend-marketplace
npm install                    # Instala dependencias
cp .env.local.example .env.local  # Crea .env.local
# Si backend no está en localhost:3001, edita NEXT_PUBLIC_API_URL

# 3. Listo para empezar
cd ..
.\dev.bat fast                # Windows
# o
bash -c "npm run dev:fast" &  # macOS/Linux
```

---

## 🧪 Verificación

Abre en tu navegador:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/products

Deberías ver:
- Página de inicio con lista de productos
- No hay errores en consola del navegador
- No hay ruido excesivo del ventilador
- PC no se ralentiza

---

## 📱 Prueba Funcionalidades

1. **Registro**
   - Ve a /register
   - Crea cuenta nueva
   - Deberías ser redirigido a home

2. **Login**
   - Ve a /login
   - Usa las credenciales creadas
   - Navbar muestra tu email

3. **Panel Admin**
   - Ve a /admin (si eres ADMIN)
   - Puedes crear/editar productos

---

## 🆘 Troubleshooting

### "PC sigue lenta/caliente"
1. Usa `dev.bat fast` en vez de `dev.bat`
2. Cierra otras aplicaciones (Chrome, Discord, etc)
3. Actualiza Node a versión 20.x
4. Aumenta Virtual Memory en Windows

### "Error: No se puede conectar a BD"
1. Verifica que MySQL está corriendo
2. Verifica credenciales en `.env`
3. Prueba conexión: `mysql -u root -p -h localhost`

### "Frontend no se actualiza"
1. Asegúrate de estar usando `npm run dev` (no `dev:fast`)
2. Limpia caché: `rm -r frontend-marketplace/.next`
3. Recarga la página del navegador

### "Puerto 3000 o 3001 en uso"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

---

## 📚 Documentación

- **Completa**: Ver [README.md](README.md)
- **Despliegue**: Ver [DEPLOY.md](DEPLOY.md)
- **Arquitectura**: Ver [ARCHITECTURE.md](ARCHITECTURE.md)
- **Optimizaciones**: Ver [OPTIMIZATION.md](OPTIMIZATION.md)

---

## 💡 Tips

- Mantén `dev.bat` o el script en carpeta raíz para iniciar ambos servicios
- Usa `npm run dev:fast` si solo necesitas testear (PC más rápida)
- ESLint corre automáticamente, ignora warnings de estilo
- TypeScript se valida automáticamente (si hay errores, no compila frontend)

---

**¡Listo para empezar!** 🎉
