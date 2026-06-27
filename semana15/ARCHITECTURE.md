# Arquitectura Técnica - ProductStore

## 🏗️ Visión General

ProductStore es una aplicación full-stack que implementa un e-commerce con autenticación basada en roles.

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                        │
│  Next.js 16 + TypeScript + Tailwind CSS + JWT Storage      │
├─────────────────────────────────────────────────────────────┤
│  • Pages: /login, /register, /, /products/[id], /admin     │
│  • Components: Navbar, Footer                              │
│  • Context: AuthContext (JWT + user data)                  │
│  • Middleware: Protección de rutas (/admin, /login)        │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/HTTPS
                     │ Bearer Token
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Render)                         │
│  Express.js + Sequelize + MySQL + JWT                      │
├─────────────────────────────────────────────────────────────┤
│  API Endpoints:                                             │
│  • POST /api/auth/register      → JWT + user               │
│  • POST /api/auth/login         → JWT + user               │
│  • GET  /api/auth/me            → user data                │
│  • GET  /api/products           → products[]               │
│  • POST /api/products           → create (ADMIN only)      │
│  • PUT  /api/products/:id       → update (ADMIN only)      │
│  • DELETE /api/products/:id     → delete (ADMIN only)      │
│  • GET  /api/categories         → categories[]             │
│  • POST /api/categories         → create (ADMIN only)      │
└────────────────────┬────────────────────────────────────────┘
                     │ SQL Queries
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (MySQL)                         │
│  • users table: id, email, password, roleId, timestamps    │
│  • roles table: id, name (CUSTOMER, ADMIN)                 │
│  • products table: id, nombre, precio, descripcion, ...    │
│  • categories table: id, nombre, descripcion, timestamps   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Modelo de Datos

### Users
```javascript
{
  id: PK,
  email: unique,
  password: hashed (bcryptjs),
  roleId: FK → Roles,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Roles
```javascript
{
  id: PK,
  name: 'CUSTOMER' | 'ADMIN',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Products
```javascript
{
  id: PK,
  nombre: string,
  precio: decimal,
  descripcion: text,
  categoryId: FK → Categories (nullable),
  imageUrl: string (nullable),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Categories
```javascript
{
  id: PK,
  nombre: string,
  descripcion: text,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Relaciones
```
User (1) ---> (N) Product    [Un usuario no tiene relación con productos]
User (N) ---> (1) Role        [Muchos usuarios pertenecen a 1 rol]
Product (N) ---> (1) Category [Muchos productos pertenecen a 1 categoría]
```

---

## 🔄 Flujos Principales

### 1. Registro

```
Cliente                    Frontend               Backend
  │                          │                       │
  │─ Ingresa datos ─────────→│                       │
  │                          │                       │
  │                          │─ POST /auth/register─→│
  │                          │    {email, password}  │
  │                          │                       │─ Validar
  │                          │                       │  email único
  │                          │                       │
  │                          │                       │─ Hash password
  │                          │                       │  con bcryptjs
  │                          │                       │
  │                          │                       │─ Crear User
  │                          │                       │  role=CUSTOMER
  │                          │                       │
  │                          │←─ {token, user} ──────│
  │                          │
  │                          │─ Guardar token
  │                          │  en localStorage
  │                          │
  │←─ Redirige a / ─────────│
  │
```

### 2. Login

```
Cliente                    Frontend               Backend
  │                          │                       │
  │─ Ingresa credenciales ──→│                       │
  │                          │                       │
  │                          │─ POST /auth/login ───→│
  │                          │    {email, password}  │
  │                          │                       │─ Buscar usuario
  │                          │                       │
  │                          │                       │─ Comparar
  │                          │                       │  password
  │                          │                       │
  │                          │                       │─ Generar JWT
  │                          │                       │  (userId, email,
  │                          │                       │   role, exp=7d)
  │                          │                       │
  │                          │←─ {token, user} ──────│
  │                          │
  │                          │─ Guardar token
  │                          │  en localStorage
  │                          │
  │←─ Redirige según rol────│
  │    (ADMIN→/admin,
  │     CUSTOMER→/)
```

### 3. Crear Producto (ADMIN)

```
Admin                      Frontend               Backend
  │                          │                       │
  │─ Completa form ─────────→│                       │
  │  (nombre, precio, etc)   │                       │
  │                          │                       │
  │─ Click "Crear" ─────────→│                       │
  │                          │                       │
  │                          │─ Obtener token
  │                          │  de localStorage
  │                          │
  │                          │─ POST /products ─────→│
  │                          │  header: Bearer {jwt} │
  │                          │                       │
  │                          │                       │─ verifyToken:
  │                          │                       │  descodifica JWT
  │                          │                       │
  │                          │                       │─ authorizeRole:
  │                          │                       │  valida ADMIN
  │                          │                       │
  │                          │                       │─ Validar
  │                          │                       │  categoría existe
  │                          │                       │
  │                          │                       │─ Crear producto
  │                          │                       │  en BD
  │                          │                       │
  │                          │←─ {product} ─────────│
  │                          │  (con categoría)
  │                          │
  │←─ Actualiza lista ──────│
```

### 4. Ver Productos (Público)

```
Usuario                    Frontend               Backend
  │                          │                       │
  │─ Abre home (/) ─────────→│                       │
  │                          │                       │
  │                          │ getProducts() 
  │                          │ en servidor (SSR)    │
  │                          │                       │
  │                          │─ GET /products ──────→│
  │                          │ (sin token)           │
  │                          │                       │
  │                          │                       │─ No requiere auth
  │                          │                       │  (GET público)
  │                          │
  │                          │                       │─ Retorna productos
  │                          │                       │  con categorías
  │                          │
  │                          │←─ [products] ────────│
  │
  │←─ HTML renderizado────────│
  │  (lista de productos)
```

---

## 🔐 Seguridad

### Capas de Protección

#### 1. Backend - Middleware Authentication
```javascript
// middleware/authMiddleware.js
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.slice(7);
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = decoded;  // userId, email, role
  next();
};
```

#### 2. Backend - Role Authorization
```javascript
// middleware/roleMiddleware.js
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return 403;  // Forbidden
    }
    next();
  };
};
```

#### 3. Frontend - Client-side Storage
```javascript
// utils/auth.ts
localStorage.setItem('auth_token', token);  // Seguro si no hay XSS
```

#### 4. Frontend - Route Protection
```javascript
// middleware.ts (Next.js)
export async function middleware(request) {
  if (pathname.startsWith('/admin')) {
    const token = getTokenFromRequest();
    const payload = await verifyToken(token);
    if (payload.role !== 'ADMIN') {
      return redirect('/');  // Redirige si no es ADMIN
    }
  }
}
```

### Ciclo de Vida JWT
```
Generación (Login):
├─ Payload: {userId, email, role}
├─ Secret: JWT_SECRET (solo backend)
├─ Exp: +7 días
└─ Firma: HMAC-SHA256

Verificación (Cada request):
├─ Frontend: obtiene token de localStorage
├─ Envía: header Authorization: Bearer {token}
├─ Backend verifyToken:
│  ├─ Descodifica con JWT_SECRET
│  ├─ Valida firma
│  ├─ Valida expiración
│  └─ Si OK → req.user = payload
└─ Middleware authorizeRole verifica rol

Expiración:
├─ Después de 7 días
├─ Frontend: token inválido en siguiente request
├─ Backend: rechaza (403)
└─ Usuario debe hacer login nuevamente
```

---

## 📊 Flow Diagram - Componentes Frontend

```
┌─────────────────────────────────────┐
│        RootLayout.tsx               │
│   (AuthProvider aquí)               │
│                                     │
│  ├─ Navbar.tsx                      │
│  │  (muestra usuario, logout)       │
│  │                                  │
│  ├─ {children}                      │
│  │  ├─ / (home)                     │
│  │  │  ├─ getProducts()  [SSR]      │
│  │  │  ├─ getCategories()[SSR]      │
│  │  │  └─ Mostrar productos         │
│  │  │     + filtro categorías       │
│  │  │                               │
│  │  ├─ /products/[id]               │
│  │  │  ├─ getProduct()   [SSR]      │
│  │  │  └─ Mostrar detalle           │
│  │  │     + categoría + imagen      │
│  │  │                               │
│  │  ├─ /login                       │
│  │  │  └─ useAuth().login()         │
│  │  │                               │
│  │  ├─ /register                    │
│  │  │  └─ useAuth().register()      │
│  │  │                               │
│  │  └─ /admin (protegida)           │
│  │     ├─ verifica auth + ADMIN     │
│  │     ├─ fetchProducts()  [CSR]    │
│  │     ├─ fetchCategories()[CSR]    │
│  │     ├─ CRUD productos            │
│  │     └─ selector categorías       │
│  │        campo imageUrl            │
│  │                                  │
│  └─ Footer.tsx                      │
│                                     │
│  AuthContext                        │
│  ├─ user: User | null               │
│  ├─ token: string | null            │
│  ├─ login(email, password)          │
│  ├─ register(email, password)       │
│  ├─ logout()                        │
│  └─ isAuthenticated: boolean        │
└─────────────────────────────────────┘
```

---

## 🔗 Flujo de Datos

### Registro a Admin Panel

```
┌─────────────────────────────────────────────────────┐
│ 1. User abre /register                              │
├─────────────────────────────────────────────────────┤
│ 2. Completa form → POST /auth/register              │
├─────────────────────────────────────────────────────┤
│ 3. Backend crea User con roleId=CUSTOMER_ROLE_ID    │
├─────────────────────────────────────────────────────┤
│ 4. Retorna JWT (role: 'CUSTOMER')                   │
├─────────────────────────────────────────────────────┤
│ 5. Frontend guarda token en localStorage            │
├─────────────────────────────────────────────────────┤
│ 6. AuthContext.user = {id, email, role: 'CUSTOMER'}│
├─────────────────────────────────────────────────────┤
│ 7. Redirige a /                                     │
├─────────────────────────────────────────────────────┤
│ 8. User intenta ir a /admin                         │
├─────────────────────────────────────────────────────┤
│ 9. middleware.ts verifica: user.role !== 'ADMIN'    │
├─────────────────────────────────────────────────────┤
│ 10. Redirige a /                                    │
├─────────────────────────────────────────────────────┤
│ 11. (Admin manualmente le asigna rol=ADMIN en BD)  │
├─────────────────────────────────────────────────────┤
│ 12. User debe hacer logout + login nuevamente       │
├─────────────────────────────────────────────────────┤
│ 13. Backend retorna nuevo JWT con role: 'ADMIN'    │
├─────────────────────────────────────────────────────┤
│ 14. AuthContext.user.role = 'ADMIN'                │
├─────────────────────────────────────────────────────┤
│ 15. User puede acceder a /admin                     │
└─────────────────────────────────────────────────────┘
```

---

## 🏛️ Patrones de Arquitectura

### Backend
- **MVC**: Models, Controllers, Routes
- **Middleware**: Procesamiento de requests secuencial
- **Error Handling**: try-catch centralizado
- **DB Connection**: Pool de conexiones con Sequelize

### Frontend
- **Context API**: Estado global de autenticación
- **Custom Hooks**: useAuth() para acceder al contexto
- **SSR (Server-Side Rendering)**: Para home y detalle
- **CSR (Client-Side Rendering)**: Para admin
- **Server Components**: Obtienen datos en servidor

---

## 🚀 Optimizaciones

### Backend
- Pool de conexiones MySQL (min: 0, max: 5)
- Logging deshabilitado en Sequelize (production)
- Validación de inputs en controllers
- JWT con exp configurada

### Frontend
- next.js cache ('no-store' donde es necesario)
- Images optimizadas (lazy loading)
- Code splitting automático
- Static generation cuando es posible

---

## 📈 Escalabilidad

### Mejoras Futuras
1. **Redis**: Cache de sesiones y datos
2. **Rate Limiting**: Prevenir abuse de API
3. **Pagination**: Limitar resultados (ya estructurado)
4. **Búsqueda**: Agregar búsqueda por nombre/categoría
5. **Órdenes**: Agregar carrito y órdenes de compra
6. **Pagos**: Integrar Stripe/PayPal
7. **Tests**: Unit + integration tests
8. **CI/CD**: GitHub Actions para auto-deploy
9. **Monitoring**: Sentry para errores, DataDog para logs
10. **Refresh Tokens**: Mejorar seguridad JWT

---

## 📚 Referencias

- [JWT.io](https://jwt.io) - JWT Debugger
- [Sequelize Docs](https://sequelize.org)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Express Middleware](https://expressjs.com/guide/using-middleware.html)
- [OWASP Security](https://owasp.org/www-project-top-ten/)

---

**Última actualización**: 2026-06-27
