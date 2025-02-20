'use client';

import React from 'react'
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/container';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

function PageHeader() {
  const router = useRouter()
  const handlePageBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/profile');
    }
  };
  return (
    <Container className="py-6 sticky top-0 z-30 bg-background w-full border-b border-foreground-muted flex justify-between items-center shrink-0">
      <button
        type="button"
        onClick={handlePageBack}
      >
        <span>
          <ChevronLeft className="w-5 h-5" />
        </span>
      </button>
      <h3 className="font-bold text-sm text-foreground/75">Edit Information</h3>
      <div></div>
    </Container>
  )
}

export default PageHeader;