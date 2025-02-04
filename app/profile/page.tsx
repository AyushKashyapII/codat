import { currentProfile } from '@/lib/current-profile';
import { initialProfile } from '@/lib/initial-profile';;
import React from 'react';

const Page = async () => {
  await initialProfile();
  const profile = await currentProfile();
  return (
    <h1>{profile?.name}</h1>
  );
};

export default Page;
