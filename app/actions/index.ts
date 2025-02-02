'use client'

import { signIn } from 'next-auth/react';

export async function socialLogin(formData: FormData) {
  const action = formData.get('action');

  if (typeof action !== 'string') {
    console.error('Invalid action, expected a string provider name');
    return;
  }

  console.log(action);

  await signIn(action, {
    redirect: true,
    callbackUrl: '/'
  });
}
