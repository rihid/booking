'use client'

import React from 'react';
import { Button } from '@/components/ui/button/button';
import Container from '@/components/ui/container';
import Link from 'next/link';

const ReserveButton = () => {
  return (
    <div className="wrapper fixed flex items-center z-40 bottom-0 h-[76px] border-t-2 border-t-slate-100 shadow-sm w-full bg-background pb-2">
      <Container className="flex items-center justify-between">
        <div className="text-foreground/50 text-xs space-y-[2px]">
          <h4 className="font-semibold text-base text-foreground/75 text-start tracking-tight leading-none">Rp. 2.500.000</h4>
          <p className="">Mangrove Morosari</p>
        </div>
        <Button
          className="bg-brand hover:bg-brand/90"
        >
          <Link href={'/confirm-n-pay'}>
            Reserve
          </Link>
        </Button>
      </Container>
    </div>
  )
}

function LayoutWithreserveButton({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <React.Fragment>
      {children}
      <ReserveButton />
    </React.Fragment>
  )
}

export default LayoutWithreserveButton;