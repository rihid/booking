import React from 'react';
import { TriangleAlert } from 'lucide-react';

type Props = {
  message?: string
}

function FormError({
  message,
}: Props) {
  if (!message) return null;
  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-xs text-destructive">
      <TriangleAlert className="h-4 w-4" />
      <p>{message}</p>
    </div>
  )
}

export default FormError