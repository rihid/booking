'use client';

import React from 'react';
import { Button } from '@/components/ui/button/button';
import { useUiLayoutStore } from '@/store/ui-layout';
import { cn } from '@/assets/styles/utils';

export type OpenModalButtonProps = {
  view: string;
  onClick?: () => void;
  variant?: string;
  className?: string;
  children: React.ReactNode
}

function OpenModalButton({
  view,
  onClick,
  variant = 'link',
  className,
  children,
  ...props
}: OpenModalButtonProps) {
  const { openModal, setModalView } = useUiLayoutStore(state => state);

  const handleClick = () => {
    setModalView(view);
    openModal(view);
    if (onClick) {
      onClick();
    }
  }

  switch (variant) {
    case 'default':
      return (
        <Button
          variant="default"
          onClick={handleClick}
          className={cn(
            "bg-brand text-xs h-auto hover:bg-brand/90",
            className
          )}
          {...props}
        >
          {children}
        </Button>
      )
    case 'link':
      return (
        <Button
          variant="link"
          onClick={handleClick}
          className={cn(
            "p-0 h-auto font-medium",
            className
          )}
          {...props}
        >
          {children}
        </Button>
      )
  }
}

export default OpenModalButton;
