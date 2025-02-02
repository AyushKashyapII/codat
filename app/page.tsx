'use client';

import { UserButton } from '@clerk/nextjs';
import React from 'react';

const Page = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
      <h1>Welcome to My Next.js Page</h1>
      <p>This is a simple `page.tsx` template.</p>
      <UserButton/>
    </div>
  );
};

export default Page;
