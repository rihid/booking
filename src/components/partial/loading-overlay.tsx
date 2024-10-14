import React from 'react';
import { Spinner } from '@/components/ui/spinner';

type LoadingOverlayProps = {
  loading: boolean;
  children: React.ReactNode;
};

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loading, children }) => {
  return (
    <div className="relative">
      {children}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 z-50">
          <Spinner size="large" className="text-background" />
        </div>
      )}
    </div>
  );
};

export default LoadingOverlay;