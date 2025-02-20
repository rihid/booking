'use client';

import React from 'react'
import { CircleAlert, X } from 'lucide-react';
import Link from 'next/link';

function WarningCompletion() {
  return (
    <div className="py-2 px-4 flex items-center justify-between text-xs text-red-800 bg-red-100" role="alert">
      <div className="flex items-center justify-center gap-x-2">
        <CircleAlert className="w-4 h-4" />
        <span>
          Before using this site you must complete your details, <Link href="/profile/edit-information" className="font-bold underline underline-offset-2">here!</Link>
        </span>
      </div>
      <button type="button" onClick={() => alert('Complete your details')}>
        <X className="w-3 h-3" />
      </button>
    </div>
  )
}

export default WarningCompletion;