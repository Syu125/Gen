'use client';

import { signIn } from 'next-auth/react';

export default function SignUp() {
  return (
    <div>
      <h1>Create a new account</h1>
      <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
        Sign up with Google
      </button>
    </div>
  );
}