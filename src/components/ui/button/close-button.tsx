"use client";

import React from 'react';
import { useUiLayoutStore } from '@/store/ui-layout';
import { CircleX } from 'lucide-react';

type Props = {
  className?: string;
}

function CloseButton({
  className,
  ...props
}: Props) {
  const { closeModal } = useUiLayoutStore( state => state);

  return (
    <button
      type="button"
      onClick={() => closeModal()}
      className="inline-block text-foreground/75 hover:text-foreground/50"
      {...props}
    >
      <CircleX className="w-6 h-6" />
    </button>
  )
}

export default CloseButton;