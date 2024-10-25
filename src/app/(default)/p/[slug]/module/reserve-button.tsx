'use client';

import React from 'react';
import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { SingleProductSchema } from '@/lib/schema';
import { currency } from '@/lib/helper';
import { useBookStore } from '@/providers/store-providers/book-provider';
import { useRouter } from 'next/navigation';

function ReserveButton({
  product
}: { product: z.infer<typeof SingleProductSchema> }) {
  const router = useRouter();
  const { product_no, product_sku, amount, uom_id } = product.prices[0];

  const { productBooked, addBooking } = useBookStore((state) => state);
  const handleAddBooking = () => {
    console.log(product)
    addBooking(product);
    router.push('/confirm-n-pay');
  }
  return (
    <div className="wrapper fixed flex items-center z-40 bottom-0 h-[76px] border-t-2 border-t-slate-100 shadow-sm w-full bg-background pb-2">
      <Container className="flex items-center justify-between">
        <div className="text-foreground/50 text-xs space-y-[2px]">
          <h4 className="font-semibold text-base text-foreground/75 text-start tracking-tight leading-none">{currency(parseInt(amount))}</h4>
          <p className="capitalize">{product.product_name}</p>
        </div>
        <Button
          className="bg-brand hover:bg-brand/90"
          onClick={() => handleAddBooking()}
        >
          Reserve
        </Button>
      </Container>
    </div>
  )
}

export default ReserveButton;