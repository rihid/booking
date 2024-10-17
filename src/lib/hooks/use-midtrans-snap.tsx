import React from "react";

const useMidtransSnap = (body: any) => {
  const handleCheckout = React.useCallback(async () => {
    try {
      const response = await fetch('/api/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      const responseData = await response.json();
      // @ts-ignore
      window.snap.pay(responseData.token);
    } catch(error) {
      console.log(error);
    }
  }, [body]);

  React.useEffect(() => {
    const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''

    let scriptTag = document.createElement('script');
    scriptTag.src = midtransScriptUrl

    scriptTag.setAttribute("data-client-key", clientKey)
    scriptTag.async = true

    document.body.appendChild(scriptTag)
    return () => {
      document.body.removeChild(scriptTag)
    }

  }, [])

  return { handleCheckout };
};

export default useMidtransSnap;
