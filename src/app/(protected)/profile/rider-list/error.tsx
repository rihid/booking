'use client';

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const handlePageBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/explore');
    }
  };

  React.useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Heading className="text-center">Something went wrong!</Heading>
      <div className="flex flex-col w-auto items-center justify-center mt-3 gap-2">
        <Button
          size="sm"
          className="w-full bg-brand hover:bg-brand/90 text-sm rounded transition-colors"
          onClick={
            () => reset()
          }
        >Try Again</Button>
        <Button
          size="sm"
          variant="outline"
          className="w-full text-sm rounded transition-colors"
          onClick={handlePageBack}
        >Back</Button>
      </div>
    </main>
  );
}