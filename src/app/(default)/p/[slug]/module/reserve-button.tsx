'use client';

import React from 'react';
import Container from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { z } from 'zod';
import { SingleProductSchema } from '@/lib/schema';
import { currency } from '@/lib/helper';

function ReserveButton({
  product
}: { product: z.infer<typeof SingleProductSchema> }) {
  const displayPrice = product.prices[0];

  return (
    <div className="wrapper fixed flex items-center z-40 bottom-0 h-[76px] border-t-2 border-t-slate-100 shadow-sm w-full bg-background pb-2">
      <Container className="flex items-center justify-between">
        <div className="text-foreground/50 text-xs space-y-[2px]">
          <h4 className="font-semibold text-base text-foreground/75 text-start tracking-tight leading-none">{currency(parseInt(displayPrice.amount))}</h4>
          <p className="capitalize">{product.product_name}</p>
        </div>
        <Button
          className="bg-brand hover:bg-brand/90"
        >
            Reserve
        </Button>
      </Container>
    </div>
  )
}

export default ReserveButton;