import React from 'react'
import Container from '@/components/ui/container';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

function LayoutRiderList({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen mb-20">
      <Container className="py-6 sticky top-0 z-30 bg-background w-full border-b border-foreground-muted flex justify-between items-center shrink-0">
        <Link href="/profile">
          <button
            type="button"
          >
            <span>
              <ChevronLeft className="w-5 h-5" />
            </span>
          </button>
        </Link>
        <h3 className="font-bold text-sm text-foreground/75">Rider List</h3>
        <div></div>
      </Container>
      {children}
    </div>
  )
}

export default LayoutRiderList;