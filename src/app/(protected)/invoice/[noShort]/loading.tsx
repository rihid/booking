import React from 'react';
import { Spinner } from '@/components/ui/spinner';
import ToopTitle from './module/top-title';
import { Skeleton } from '@/components/ui/skeleton';
import Container from '@/components/ui/container';

function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <ToopTitle label='Invoice' />
      <Container>
        <div className="flex items-start bg-background py-6 gap-x-6">
          <div className="w-32 flex-shrink-0">
            <Skeleton className="aspect-w-6 aspect-h-4 w-full h-full" />
          </div>
          <div className="flex flex-col space-y-3 flex-grow min-w-0">
            <div className="flex flex-col gap-2">
              <Skeleton className="w-36 h-4" />
              <Skeleton className="w-44 h-3" />
            </div>
            <Skeleton className="w-24 h-4" />
          </div>
        </div>
        <div className="flex flex-col gap-3 justify-center items-center mb-8">
          <Skeleton className="w-44 h-6" />
          <Skeleton className="w-44 h-8" />
          <Skeleton className="h-3 w-full" />
        </div>
      </Container>
      <Container className='border-t-4 border-slate-100 bg-background py-8 space-y-6'>
        <div className="flex justify-between gap-2">
          <Skeleton className="w-44 h-6" />
          <Skeleton className="w-44 h-6" />
        </div>
        <div className="w-full flex items-center justify-center">
          <Skeleton className="w-44 h-10" />
        </div>
      </Container>
    </div>
  )
}

export default Loading;