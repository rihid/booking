import React from 'react';
import { getSession } from '@/lib/session';
import { setHeader } from '@/lib/data/endpoints';

async function Setting() {
  const session = await getSession();
  return (
    <>
      <div>
        {JSON.stringify(session, null, 2)}
        <span>testing</span>
      </div>
    </>
  )
}

export default Setting