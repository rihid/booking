import React from 'react';
import { getSession } from '@/lib/session';

async function Page() {
  const session = await getSession()
  // @ts-ignore
  console.log(session.user)
  return (
    <div>
      {
        // @ts-ignore
        JSON.stringify(session.user, null, 1)
      }
    </div>
  )
}

export default Page;