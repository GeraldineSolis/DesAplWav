import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from '@/lib/auth-users';

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: 'Name, email and password are required.' },
      { status: 400 },
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: 'Password must be at least 6 characters long.' },
      { status: 400 },
    );
  }

  if (findUserByEmail(email)) {
    return NextResponse.json(
      { error: 'A user with that email already exists.' },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = createUser({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash,
  });

  if (!user) {
    return NextResponse.json(
      { error: 'Unable to create the account.' },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    user: { id: user.id, name: user.name, email: user.email },
  });
}
