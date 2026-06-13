'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGithub, FaGoogle } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [message, setMessage] = useState('');
  const [registerMessage, setRegisterMessage] = useState('');

  const handleCredentialsSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: '/dashboard',
    });

    if (result?.ok) {
      router.push('/dashboard');
      return;
    }

    setMessage('Invalid email or password. If you exceeded the retry limit, try again later.');
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setRegisterMessage('');

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setRegisterMessage(data.error ?? 'Unable to create the account.');
      return;
    }

    setRegisterMessage('Account created successfully. You can sign in with your email and password now.');
    setRegisterName('');
    setRegisterEmail('');
    setRegisterPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <section className="rounded-2xl bg-white p-8 shadow-md ring-1 ring-slate-200">
          <h1 className="text-2xl font-black text-slate-950">Sign in</h1>
          <p className="mt-2 text-sm text-slate-700">Use your credentials, Google, or GitHub.</p>

          <form onSubmit={handleCredentialsSignIn} className="mt-6 space-y-4">
            <label className="block text-sm font-semibold text-slate-900">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-slate-900">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                placeholder="••••••••"
                required
              />
            </label>

            <button
              type="submit"
              className="w-full rounded bg-black px-4 py-2 text-white transition hover:bg-gray-700"
            >
              Sign in with credentials
            </button>
          </form>

          {message ? <p className="mt-4 text-sm text-red-600">{message}</p> : null}

          <div className="mt-6 space-y-3">
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="flex w-full items-center justify-center gap-2 rounded bg-gray-800 px-4 py-2 text-white transition hover:bg-black"
            >
              <FaGoogle />
              Continue with Google
            </button>

            <button
              onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
              className="flex w-full items-center justify-center gap-2 rounded bg-gray-900 px-4 py-2 text-white transition hover:bg-black"
            >
              <FaGithub />
              Continue with GitHub
            </button>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-8 shadow-md ring-1 ring-slate-200">
          <h2 className="text-xl font-black text-slate-950">Create an account</h2>
          <p className="mt-2 text-sm text-slate-700">Register locally with an email and password.</p>

          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            <label className="block text-sm font-semibold text-slate-900">
              Full name
              <input
                type="text"
                value={registerName}
                onChange={(event) => setRegisterName(event.target.value)}
                className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                placeholder="Jane Doe"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-slate-900">
              Email
              <input
                type="email"
                value={registerEmail}
                onChange={(event) => setRegisterEmail(event.target.value)}
                className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-slate-900">
              Password
              <input
                type="password"
                value={registerPassword}
                onChange={(event) => setRegisterPassword(event.target.value)}
                className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                placeholder="At least 6 characters"
                required
              />
            </label>

            <button
              type="submit"
              className="w-full rounded bg-gray-700 px-4 py-2 text-white transition hover:bg-black"
            >
              Create account
            </button>
          </form>

          {registerMessage ? <p className="mt-4 text-sm text-green-700">{registerMessage}</p> : null}
        </section>
      </div>
    </div>
  );
}