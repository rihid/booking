'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Heading className="text-center">Something went wrong!</Heading>
      <Button
        size="sm"
        className=" mt-3 bg-brand hover:bg-brand/90 text-sm rounded transition-colors"
        onClick={
          () => reset()
        }
      >Try Again</Button>
    </main>
  );
}