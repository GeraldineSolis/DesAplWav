import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcrypt';
import {
  findUserByEmail,
  isAccountLocked,
  markFailedAttempt,
  resetFailedAttempts,
} from '@/lib/auth-users';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signIn',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase() ?? '';
        const password = credentials?.password?.toString() ?? '';

        if (!email || !password) {
          return null;
        }

        if (isAccountLocked(email)) {
          throw new Error('Too many failed login attempts. Please try again in 10 minutes.');
        }

        const user = findUserByEmail(email);

        if (!user) {
          const attempt = markFailedAttempt(email);

          if (attempt.isLocked) {
            throw new Error('Too many failed login attempts. Please try again in 10 minutes.');
          }

          return null;
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
          const attempt = markFailedAttempt(email);

          if (attempt.isLocked) {
            throw new Error('Too many failed login attempts. Please try again in 10 minutes.');
          }

          return null;
        }

        resetFailedAttempts(email);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id?: string }).id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as typeof session.user & { id?: string }).id = token.id as string;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };