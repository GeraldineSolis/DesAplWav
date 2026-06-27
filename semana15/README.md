# 🛍️ ProductStore - E-commerce Full Stack

Aplicación completa de gestión de productos con autenticación, roles y categorías.

**Stack Tecnológico:**
- **Backend**: Node.js + Express + Sequelize
- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS
- **BD**: MySQL
- **Auth**: JWT + bcryptjs
- **Deploy**: Render (backend) + Vercel (frontend)

---

## 📋 Características

### ✅ Funcionalidades Implementadas

1. **Autenticación & Autorización**
   - Registro e login con JWT
   - Roles: CUSTOMER y ADMIN
   - Middleware de protección de rutas
   - Contexto de autenticación en frontend

2. **Gestión de Productos**
   - CRUD completo (Create, Read, Update, Delete)
   - Solo ADMIN puede crear/editar/borrar
   - CUSTOMER puede ver productos

3. **Categorías**
   - Productos asociados a categorías
   - Filtrado por categoría en home
   - Selector de categoría al crear/editar

4. **Imágenes**
   - Soporte para URLs de imágenes en productos
   - Visualización en listado y detalle

5. **Seguridad**
   - Contraseñas hasheadas con bcryptjs
   - JWT con expiración de 7 días
   - CORS configurado
   - Middleware de autenticación en backend
   - Middleware de protección de rutas en frontend

---

## 🚀 Quick Start

### Requisitos Previos
- Node.js 18+
- MySQL 5.7+
- Git

### Instalación Local

#### 1. Backend

```bash
cd backend-marketplace
npm install
```

Crear `.env` (copiar de `.env.example`):
```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=productstore
JWT_SECRET=your_secret_key
```

Iniciar servidor:
```bash
npm run dev
```

Servidor disponible en: `http://localhost:3001`

#### 2. Frontend

```bash
cd frontend-marketplace
npm install
```

Crear `.env.local` (copiar de `.env.local.example`):
```bash
cp .env.local.example .env.local
```

Iniciar desarrollo:
```bash
npm run dev
```

Frontend disponible en: `http://localhost:3000`

---

## 📁 Estructura del Proyecto

```
proyecto/
│
├── backend-marketplace/
│   ├── src/
│   │   ├── app.js                    # Configuración de Express
│   │   ├── server.js                 # Entry point
│   │   ├── config/
│   │   │   └── database.js          # Configuración Sequelize
│   │   ├── models/
│   │   │   ├── User.js              # Modelo de usuario
│   │   │   ├── Role.js              # Modelo de rol
│   │   │   ├── Product.js           # Modelo de producto
│   │   │   └── Category.js          # Modelo de categoría
│   │   ├── controllers/
│   │   │   ├── auth.controller.js   # Login, registro, getMe
│   │   │   ├── product.controller.js
│   │   │   └── category.controller.js
│   │   ├── routes/
│   │   │   ├── auth.js              # /api/auth/*
│   │   │   ├── products.js          # /api/products/*
│   │   │   └── categories.js        # /api/categories/*
│   │   └── middleware/
│   │       ├── authMiddleware.js    # verifyToken
│   │       └── roleMiddleware.js    # authorizeRole
│   ├── .env                          # Variables (NO commitar)
│   ├── .env.example                  # Template
│   └── package.json
│
├── frontend-marketplace/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx           # Root layout con AuthProvider
│   │   │   ├── page.tsx             # Home con filtro de categorías
│   │   │   ├── login/page.tsx       # Página de login
│   │   │   ├── register/page.tsx    # Página de registro
│   │   │   ├── products/
│   │   │   │   └── [id]/page.tsx    # Detalle de producto
│   │   │   └── admin/page.tsx       # Panel admin (solo ADMIN)
│   │   ├── components/
│   │   │   ├── Navbar.tsx           # Navegación (dinámica según auth)
│   │   │   ├── Footer.tsx           # Pie de página
│   │   ├── context/
│   │   │   └── AuthContext.tsx      # Contexto de autenticación
│   │   ├── types/
│   │   │   ├── product.ts           # Interfaces de productos
│   │   │   └── auth.ts              # Interfaces de auth
│   │   ├── utils/
│   │   │   └── auth.ts              # Helpers de autenticación
│   │   └── app/globals.css          # Estilos globales
│   ├── middleware.ts                # Protección de rutas Next.js
│   ├── .env.local                   # Variables (NO commitar)
│   ├── .env.local.example           # Template
│   └── package.json
│
├── DEPLOY.md                        # Guía de despliegue
└── README.md                        # Este archivo

```

---

## 🔐 Autenticación

### Flujo de Registro

1. Usuario completa formulario en `/register`
2. Frontend envía POST a `/api/auth/register`
3. Backend: valida, hashea password, crea usuario con rol CUSTOMER
4. Backend devuelve JWT + datos usuario
5. Frontend guarda JWT en localStorage
6. Redirige a home

### Flujo de Login

1. Usuario completa formulario en `/login`
2. Frontend envía POST a `/api/auth/login`
3. Backend: valida email, compara password
4. Backend devuelve JWT + rol
5. Frontend guarda JWT en localStorage
6. AuthContext actualiza estado
7. Redirige según rol:
   - ADMIN → `/admin`
   - CUSTOMER → `/`

### JWT Storage

- **Lugar**: localStorage (clave: `auth_token`)
- **Duración**: 7 días
- **Acceso**: Se envía en header `Authorization: Bearer {token}`

---

## 📊 Roles y Permisos

### CUSTOMER (Por defecto en registro)
- ✅ Ver home
- ✅ Ver productos
- ✅ Ver detalle de producto
- ❌ Crear/editar/borrar productos
- ❌ Acceder a /admin

### ADMIN (Asignar manualmente en BD)
- ✅ Todas las permisos de CUSTOMER
- ✅ Crear/editar/borrar productos
- ✅ Acceder a /admin
- ✅ Crear/editar/borrar categorías

---

## 🛣️ Rutas de API

### Autenticación
```
POST   /api/auth/register    # Registrarse
POST   /api/auth/login       # Iniciar sesión
GET    /api/auth/me          # Datos del usuario autenticado (requiere token)
```

### Productos
```
GET    /api/products         # Obtener todos (público)
GET    /api/products/:id     # Obtener uno (público)
POST   /api/products         # Crear (requiere ADMIN)
PUT    /api/products/:id     # Actualizar (requiere ADMIN)
DELETE /api/products/:id     # Eliminar (requiere ADMIN)
```

### Categorías
```
GET    /api/categories       # Obtener todos (público)
GET    /api/categories/:id   # Obtener uno (público)
POST   /api/categories       # Crear (requiere ADMIN)
PUT    /api/categories/:id   # Actualizar (requiere ADMIN)
DELETE /api/categories/:id   # Eliminar (requiere ADMIN)
```

---

## 🛡️ Protección de Rutas

### Backend (Middleware)

```javascript
// Protección básica
router.post("/", verifyToken, productController.createProduct);

// Protección por rol
router.post("/", verifyToken, authorizeRole('ADMIN'), productController.createProduct);
```

### Frontend (Middleware de Next.js)

```javascript
// middleware.ts protege:
// - /admin → requiere autenticación + rol ADMIN
// - /login y /register → redirige si ya está autenticado
```

---

## 🔄 Flujo de Solicitudes

### Crear Producto (ADMIN)

```
1. ADMIN completa form en /admin
2. Click "Crear"
3. Frontend valida datos
4. Obtiene token de localStorage
5. POST /api/products con token en header
6. Middleware verifyToken valida JWT
7. Middleware authorizeRole valida rol ADMIN
8. Backend crea producto en BD
9. Devuelve producto con categoría incluida
10. Frontend recarga lista de productos
```

### Ver Productos (Público)

```
1. Usuario abre home (/)
2. Servidor renderiza page.tsx
3. Ejecuta getProducts() (fetch en servidor)
4. Obtiene productos con categorías
5. Renderiza HTML en servidor
6. Envía al navegador
7. Frontend renderiza lista con categorías e imágenes
```

---

## 🎨 Estilos

La aplicación usa **Tailwind CSS** con:
- Color primario: Gray-900 (casi negro)
- Paleta de grises
- Responsive design (mobile-first)
- Componentes reutilizables

---

## 📦 Dependencias Principales

### Backend
- `express`: Framework web
- `sequelize`: ORM para MySQL
- `mysql2`: Driver MySQL
- `jsonwebtoken`: Generación de JWT
- `bcryptjs`: Hash de contraseñas
- `cors`: Manejo de CORS
- `dotenv`: Variables de entorno

### Frontend
- `next`: Framework React
- `react`: Librería UI
- `tailwindcss`: Utilidades CSS
- `typescript`: Type safety
- `jose`: Verificación de JWT

---

## 🧪 Testing Manual

### Checklist de Funcionalidades

- [ ] **Registro**: Crear nueva cuenta → Logout → Login
- [ ] **Login**: Iniciar sesión → Ver datos en navbar
- [ ] **Productos**: Ver lista, detalle, categoría, imagen
- [ ] **Admin - Crear**: Crear producto con categoría e imagen
- [ ] **Admin - Editar**: Modificar producto existente
- [ ] **Admin - Eliminar**: Borrar producto (con confirmación)
- [ ] **Filtro**: Filtrar por categoría desde home
- [ ] **Protección**: Intenta acceder a /admin sin ser ADMIN → Redirecciona
- [ ] **CORS**: Requests funcionan sin errores de CORS
- [ ] **JWT**: Token expira después de 7 días

---

## 🚢 Despliegue

Ver [DEPLOY.md](./DEPLOY.md) para instrucciones completas de:
- Despliegue en Render (Backend)
- Despliegue en Vercel (Frontend)
- Configuración de variables de entorno
- Troubleshooting

---

## 🐛 Troubleshooting

### CORS Error
```
Error: Access to XMLHttpRequest blocked by CORS policy
```
**Solución**: Verifica que `CORS_ORIGIN` en backend coincida con tu URL de frontend

### JWT Inválido
```
Error: Token inválido o expirado
```
**Solución**: 
- Regenera token haciendo login nuevamente
- Verifica que JWT_SECRET es el mismo en backend

### Base de Datos
```
Error: Conexión rechazada
```
**Solución**:
- Verifica que MySQL está corriendo
- Revisa credenciales en .env
- Verifica que BD existe

---

## 📚 Documentación Adicional

- JWT: https://jwt.io
- Sequelize: https://sequelize.org
- Next.js: https://nextjs.org
- Express: https://expressjs.com

---

## 👨‍💻 Desarrollo

### Agregar Nueva Funcionalidad

1. Crear rama: `git checkout -b feature/mi-feature`
2. Hacer cambios
3. Testar localmente
4. Commit: `git commit -am "feat: descripción"`
5. Push: `git push origin feature/mi-feature`
6. PR a main

### Estándar de Código

- Backend: JavaScript/Node.js (CommonJS)
- Frontend: TypeScript + React
- Linting: ESLint configurado
- Formatting: Prettier recomendado

---

## 📄 Licencia

Este proyecto es código de ejemplo para propósitos educativos.

---

## 📞 Soporte

Para problemas o preguntas:
1. Revisar este README
2. Revisar DEPLOY.md para issues de producción
3. Revisar logs de consola (browser) o terminal
4. Verificar archivo .env está configurado correctamente

---

**Última actualización**: 2026-06-27

**Versión**: 1.0.0 (Autenticación, Roles, Categorías, Imágenes)
