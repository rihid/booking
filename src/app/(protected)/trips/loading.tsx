import React from 'react';
import { Spinner } from '@/components/ui/spinner';
import DashboardSkeleton from '@/components/partial/loader';

function Loading() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Spinner />
    </div>
  )
}

export default Loading;