import { withAuth } from 'next-auth/middleware';

export default withAuth(function middleware() {
  return null;
});

export const config = {
  matcher: ['/dashboard', '/profile'],
};