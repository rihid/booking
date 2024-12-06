'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

function ShareButton() {
  const handleClick = () => {
    const url = window.location.href;

    navigator.clipboard.writeText(url).then(() => {
      toast.success("Copied to clipboard");
    }).catch((err) => {
      toast.error("Failed");
      console.log(err);
    });
  }
  return (
    <Button
    type='button'
    variant="outline"
    size="icon"
    className="bg-background/50 rounded-full h-7 w-7 p-1"
    onClick={handleClick}
  >
    <Share2 className="w-4 h-4 text-muted-foreground" />
  </Button>
  )
}

export default ShareButton;