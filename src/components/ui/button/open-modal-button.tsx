'use client';

import React from 'react';
import { Button } from '@/components/ui/button/button';
import { useUiLayoutStore } from '@/store/ui-layout';

export type OpenModalButtonProps = {
  view: string;
  variant?: string;
  className?: string;
  children: React.ReactNode
}
function OpenModalButton({
  view,
  variant = 'link',
  className,
  children,
  ...props
}: OpenModalButtonProps) {
  const { openModal, setModalView } = useUiLayoutStore(state => state);

  const handleClick = () => {
    setModalView(view);
    return openModal(view);
  }

  switch (variant) {
    case 'default':
      return (
        <Button
          variant="default"
          onClick={handleClick}
          className="bg-brand text-xs h-auto hover:bg-brand/90"
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
          className="p-0 h-auto font-medium"
          {...props}
        >
          {children}
        </Button>
      )
  }

}

export default OpenModalButton;