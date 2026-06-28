import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';

interface TokenPayload {
  userId: number;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  iat: number;
  exp: number;
}

async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const verified = await jose.jwtVerify(token, secret);
    return verified.payload as unknown as TokenPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/', '/products', '/register', '/login'];
  
  // Rutas protegidas
  const adminRoutes = ['/admin'];
  const protectedRoutes = ['/admin'];

  // Obtener token del header o de las cookies
  const authHeader = request.headers.get('authorization');
  let token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    token = request.cookies.get('auth_token')?.value || null;
  }

  // Verificar si la ruta es pública
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(pathname + '/')
  );

  if (isPublicRoute && pathname !== '/products' && !pathname.startsWith('/products/')) {
    return NextResponse.next();
  }

  // Si es /products o /products/[id] - siempre permitir (son públicas)
  if (pathname === '/products' || pathname.startsWith('/products/')) {
    return NextResponse.next();
  }

  // Verificar si la ruta es protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Si no hay token y es ruta protegida, redirigir a login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verificar token
  const payload = await verifyToken(token);
  
  if (!payload) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protección por rol
  if (pathname.startsWith('/admin')) {
    if (payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Si llegamos aquí, permitir acceso
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
