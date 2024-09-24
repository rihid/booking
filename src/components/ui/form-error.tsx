import React from 'react';
import { TriangleAlert } from 'lucide-react';

type FormErroType = {
  message?: string
}

function FormError({
  message,
}: FormErroType) {
  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-xs text-destructive">
      <TriangleAlert className="h-4 w-4" />
      <p>{message}</p>
    </div>
  )
}

export default FormError