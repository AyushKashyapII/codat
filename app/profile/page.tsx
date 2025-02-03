import { initialProfile } from '@/lib/initial-profile';
import { UserButton } from '@clerk/nextjs';
import React from 'react';

const Page = async () => {
  const profile = await initialProfile();
  return (
    <h1>Hello Mrinal</h1>
  );
};

export default Page;
