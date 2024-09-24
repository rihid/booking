import React from 'react';
import { auth } from '@/auth';

async function Setting() {
  const session = await auth();
  return (
    <div>{JSON.stringify(session)}</div>
  )
}

export default Setting