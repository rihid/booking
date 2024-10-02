import React from 'react';
import { getSession } from '@/lib/session';

async function Setting() {
  const session = await getSession();

  return (
    <>
      <div>{JSON.stringify(session, null, 2)}</div>
    </>
  )
}

export default Setting