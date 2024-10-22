'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useBookStore } from '@/providers/store-providers/book-provider';

function ActionComp({
  status,
  booking,
}: {
  status: any;
  booking: any;
}) {
  const { paymentLink } = useBookStore((state) => state);
  const paymentVal = paymentLink.find(p => p.book_id === booking.id);
  return (
    <div className="mt-8 flex justify-center items-center">
      <div className="flex flex-col items-center gap-4 w-auto">
        {status.status_code === '201' &&
          <Link
          href={paymentVal?.url_payment || '#'}
          >
            <Button className="w-full bg-brand hover:bg-brand/90">Pay Now</Button>
          </Link>
        }
        <Button className="w-full">Back</Button>
      </div>
    </div>
  )
}

export default ActionComp;