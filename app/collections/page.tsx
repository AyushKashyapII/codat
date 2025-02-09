import { initialProfile } from '@/lib/initial-profile'
import React from 'react'

async function page() {
  await initialProfile();
  return (
    <div>page</div>
  )
}

export default page