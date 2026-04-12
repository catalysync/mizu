'use client';

import { useState, type FormEvent } from 'react';
import { Button, Inline, Input, Stack } from '@aspect/react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

type Mode = 'sign-in' | 'sign-up';

export function SignInForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('sign-in');
  const [email, setEmail] = useState('test@tweakmizu.dev');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('Test User');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      if (mode === 'sign-up') {
        const res = await authClient.signUp.email({
          email,
          password,
          name,
        });
        if (res.error) {
          setError(res.error.message ?? 'Sign-up failed');
          return;
        }
      } else {
        const res = await authClient.signIn.email({ email, password });
        if (res.error) {
          setError(res.error.message ?? 'Sign-in failed');
          return;
        }
      }
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Sign in form">
      <Stack gap="1rem">
        <Inline gap="0.5rem" align="center">
          <Button
            type="button"
            size="sm"
            variant={mode === 'sign-in' ? 'primary' : 'ghost'}
            onClick={() => setMode('sign-in')}
          >
            Sign in
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === 'sign-up' ? 'primary' : 'ghost'}
            onClick={() => setMode('sign-up')}
          >
            Create account
          </Button>
        </Inline>

        {mode === 'sign-up' ? (
          <Input
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        ) : null}

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
          minLength={6}
        />

        {error ? (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" variant="primary" loading={busy}>
          {mode === 'sign-up' ? 'Create account' : 'Sign in'}
        </Button>
      </Stack>
    </form>
  );
}
