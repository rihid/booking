'use client';

import React from 'react';
import Container from '@/components/ui/container';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Heading from '@/components/ui/heading';
import { useRouter } from 'next/navigation';

function ToopTitle({ label}: {label: string;}) {
  const router = useRouter();
  return (
    <Container className="py-6 sticky top-0 z-30 bg-background w-full border-b border-foreground-muted flex justify-between items-center shrink-0">
      <button type='button' onClick={() => router.back()}>
        <ChevronLeft className="w-5 h-5" />
      </button>
      <Heading variant="sm" className="text-foreground ml-4">{label}</Heading>
      <div></div>
    </Container>
  )
}

export default ToopTitle;