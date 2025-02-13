'use client';

import React from 'react';


function MidtransScript() {
  React.useEffect(() => {
    // snap script midtrans here
    const midtransScriptUrl = process.env.NEXT_PUBLIC_MIDTRANS_SNAP_SCRIPT as string;
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''

    let scriptTag = document.createElement('script');
    scriptTag.src = midtransScriptUrl

    scriptTag.setAttribute("data-client-key", clientKey)
    scriptTag.async = true

    document.body.appendChild(scriptTag)
    return () => {
      document.body.removeChild(scriptTag)
    }
  }, []);
  return (
    <div></div>
  )
}

export default MidtransScript