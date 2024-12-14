'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useBookStore } from '@/providers/store-providers/book-provider';

function ActionComp({
  status,
  booking,
  paymentToken,
}: {
  status: any;
  booking: any;
  paymentToken?: any;
}) {
  const midtransPaymentLink = process.env.NEXT_PUBLIC_MIDTRANS_REDIRECT_URL + paymentToken;
  return (
    <div className="mt-8 flex justify-center items-center">
      <div className="flex flex-col items-center gap-4 w-auto">
        {status.status_code === '201' &&
          <Link
            href={midtransPaymentLink || '#'}
          >
            <Button className="w-full bg-brand hover:bg-brand/90">Pay Now</Button>
          </Link>
        }
        <Link
          href="/"
        >
          <Button className="w-full">Back to home</Button>
        </Link>
      </div>
    </div>
  )
}

export default ActionComp;