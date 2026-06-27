# Guía de Despliegue - ProductStore

Esta guía cubre el despliegue de la aplicación full-stack en Render (backend) y Vercel (frontend).

## Backend - Despliegue en Render

### Prerequisitos
- Cuenta en [Render.com](https://render.com)
- Git repositorio sincronizado

### Pasos

1. **Crear Nueva Web Service en Render**
   - Ve a https://dashboard.render.com
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio GitHub
   - Selecciona la rama `main` (o tu rama de producción)

2. **Configurar el Servicio**
   - **Name**: `productstore-api` (o tu nombre preferido)
   - **Root Directory**: `backend-marketplace`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`

3. **Variables de Entorno**
   - En Render, ve a "Environment" y agrega:
   ```
   DB_HOST=tu_db_host
   DB_PORT=3306
   DB_USER=tu_db_user
   DB_PASSWORD=tu_db_password
   DB_NAME=tu_db_name
   PORT=3001
   JWT_SECRET=tu_jwt_secret_super_seguro_aqui
   CORS_ORIGIN=https://tu-dominio-frontend.vercel.app
   NODE_ENV=production
   ```

4. **Desplegar**
   - Click en "Create Web Service"
   - Render ejecutará automáticamente el build y start
   - Tu API estará disponible en: `https://productstore-api.onrender.com`

### Consideraciones

- **Base de datos**: Asegúrate de tener una BD MySQL accesible desde Render
- **Tiempo de arranque**: El primer despliegue puede tardar 1-2 minutos
- **Auto-deploy**: Render despliega automáticamente cuando haces push a la rama conectada

---

## Frontend - Despliegue en Vercel

### Prerequisitos
- Cuenta en [Vercel.com](https://vercel.com)
- Git repositorio sincronizado

### Pasos

1. **Conectar Repositorio**
   - Ve a https://vercel.com/dashboard
   - Click en "Add New..." → "Project"
   - Selecciona tu repositorio de GitHub
   - Autoriza a Vercel acceder a tus repos

2. **Configurar el Proyecto**
   - **Project Name**: `productstore-frontend` (o tu nombre preferido)
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend-marketplace`

3. **Variables de Entorno**
   - En la sección "Environment Variables", agrega:
   ```
   NEXT_PUBLIC_API_URL=https://productstore-api.onrender.com/api
   ```

4. **Desplegar**
   - Click en "Deploy"
   - Vercel construirá tu aplicación Next.js
   - Tu frontend estará disponible en: `https://productstore-frontend.vercel.app`

### Consideraciones

- **NEXT_PUBLIC_**: Las variables que comiencen con `NEXT_PUBLIC_` estarán disponibles en el navegador
- **Build time**: El build puede tardar 2-5 minutos
- **Auto-deploy**: Vercel despliega automáticamente en cada push a la rama conectada

---

## Configuración post-despliegue

### 1. Actualizar CORS en Backend
Una vez que tengas tu URL de Vercel, actualiza la variable en Render:
```
CORS_ORIGIN=https://productstore-frontend.vercel.app
```

### 2. Verificar Conectividad
- Abre tu frontend: https://productstore-frontend.vercel.app
- Intenta registrarte y ver si funciona la conexión a la API
- Verifica la consola del navegador para errores de CORS

### 3. Test de Funcionalidades

- [ ] Registro de usuario
- [ ] Login de usuario
- [ ] Ver productos
- [ ] Ver detalle de producto
- [ ] Admin puede crear/editar/borrar productos
- [ ] Customer no puede acceder a /admin
- [ ] Filtro de categorías funciona

---

## Troubleshooting

### Error: CORS origin not allowed
**Solución**: Verifica que `CORS_ORIGIN` en Render coincida exactamente con tu URL de Vercel

### Error: JWT_SECRET no definido
**Solución**: Asegúrate de agregar `JWT_SECRET` en las variables de entorno de Render

### Error: Conexión a BD rechazada
**Solución**: Verifica que la BD está accesible desde internet y que las credenciales son correctas

### Error: Build falla en Vercel
**Solución**: Verifica logs en Vercel → Project → Deployments → Build logs

---

## Estructura esperada

```
proyecto/
├── backend-marketplace/
│   ├── src/
│   ├── package.json
│   ├── .env (no incluir en git)
│   └── .env.example
├── frontend-marketplace/
│   ├── src/
│   ├── package.json
│   ├── .env.local (no incluir en git)
│   └── .env.local.example
└── .gitignore (incluir *.env, *.env.local)
```

---

## Variables de entorno recomendadas para desarrollo

**Backend (.env)**
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=productstore_dev
PORT=3001
JWT_SECRET=dev_secret_key_change_in_production
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
NODE_ENV=development
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## Seguridad

### Para Producción
1. ✅ Cambiar `JWT_SECRET` a una clave fuerte y única
2. ✅ Cambiar `CORS_ORIGIN` a tu dominio específico (NO usar `*`)
3. ✅ Usar HTTPS en todo
4. ✅ Configurar certificados SSL (Render y Vercel lo hacen automáticamente)
5. ✅ Revisar logs regularmente para actividad sospechosa

---

## Rollback

Si necesitas revertir a una versión anterior:

**En Render**:
1. Ve a "Deployments"
2. Encuentra la versión anterior que funciona
3. Click en el menú de 3 puntos → "Redeploy"

**En Vercel**:
1. Ve a "Deployments"
2. Encuentra la versión anterior
3. Click en "Redeploy"

---

## Monitoreo

### Render
- Ve a "Logs" para ver logs en tiempo real
- Ve a "Metrics" para ver CPU, memoria, requests

### Vercel
- Ve a "Analytics" para ver performance
- Ve a "Monitoring" para errores y alertas

---

## Próximos pasos

1. Configurar un dominio personalizado
2. Configurar SSL certificate
3. Implementar analytics
4. Configurar backup automático de BD
5. Implementar CI/CD adicional (tests automáticos)
