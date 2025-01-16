import React from 'react';
import { Spinner } from '@/components/ui/spinner';

function Loading() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Spinner />
    </div>
  )
}

export default Loading;