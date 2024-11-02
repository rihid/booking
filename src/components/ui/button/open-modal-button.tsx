'use client';

import React from 'react';
import { Button } from '@/components/ui/button/button';
import { useUiLayoutStore } from '@/store/ui-layout';
import { cn } from '@/assets/styles/utils';

export type OpenModalButtonProps = {
  view: string;
  onClickChange?: () => void;
  variant?: string;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode
}

function OpenModalButton({
  view,
  onClickChange,
  variant = 'link',
  className,
  children,
  disabled =false,
  ...props
}: OpenModalButtonProps) {
  const { openModal, setModalView } = useUiLayoutStore(state => state);

  const handleClick = () => {
    setModalView(view);
    openModal(view);
    if (onClickChange) {
      onClickChange();
    }
  }

  switch (variant) {
    case 'default':
      return (
        <Button
          type='button'
          variant="default"
          onClick={handleClick}
          disabled={disabled}
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
          type='button'
          variant="link"
          onClick={handleClick}
          disabled={disabled}
          className={cn(
            "p-0 h-auto font-medium",
            className
          )}
          {...props}
        >
          {children}
        </Button>
      )
    case 'outline':
      return (
        <Button
          type='button'
          variant="outline"
          onClick={handleClick}
          disabled={disabled}
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
