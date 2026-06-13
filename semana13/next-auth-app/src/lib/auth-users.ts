export type AppUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: number;
};

const users: AppUser[] = [];

const failedAttempts = new Map<string, { count: number; lockedUntil: number }>();

export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_MINUTES = 10;

export function findUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  return users.find((user) => user.email.toLowerCase() === normalizedEmail);
}

export function createUser(user: Omit<AppUser, 'id' | 'createdAt'>) {
  const normalizedEmail = user.email.trim().toLowerCase();

  const existingUser = users.find((entry) => entry.email.toLowerCase() === normalizedEmail);

  if (existingUser) {
    return null;
  }

  const newUser: AppUser = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: Date.now(),
    ...user,
    email: normalizedEmail,
  };

  users.push(newUser);

  return newUser;
}

export function getFailedAttempt(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  return failedAttempts.get(normalizedEmail);
}

export function markFailedAttempt(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const current = failedAttempts.get(normalizedEmail) ?? { count: 0, lockedUntil: 0 };
  const nextCount = current.count + 1;

  const lockedUntil = nextCount >= MAX_LOGIN_ATTEMPTS
    ? Date.now() + LOCKOUT_MINUTES * 60 * 1000
    : 0;

  failedAttempts.set(normalizedEmail, {
    count: nextCount,
    lockedUntil,
  });

  return {
    count: nextCount,
    lockedUntil,
    isLocked: nextCount >= MAX_LOGIN_ATTEMPTS,
  };
}

export function resetFailedAttempts(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  failedAttempts.delete(normalizedEmail);
}

export function isAccountLocked(email: string) {
  const attempt = getFailedAttempt(email);

  if (!attempt) {
    return false;
  }

  if (attempt.lockedUntil > Date.now()) {
    return true;
  }

  failedAttempts.delete(email.trim().toLowerCase());
  return false;
}
