import { Suspense } from 'react';
import SignUpForm from '@/components/sign-up-form/SignUpForm';

export default function SignUpEvent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpForm />
    </Suspense>
  );
}
