'use client';

import React from 'react';
import { usePaymentStore } from '@/providers/store-providers/payment-provider';

function PaymentLinkWatcher({
  bookings,
}: {
  bookings: any;
}) {

  const { refreshPaymentLink } = usePaymentStore((state) => state);

  React.useEffect(() => {
    console.log('refresh paymentlink')
    refreshPaymentLink();
  }, [refreshPaymentLink]);
  return (
    <></>
  )
}

export default PaymentLinkWatcher;