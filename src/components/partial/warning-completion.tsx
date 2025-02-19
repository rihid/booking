'use client';

import React from 'react'
import { CircleAlert } from 'lucide-react';
import Link from 'next/link';

function WarningCompletion() {
  return (
    <div className="p-2 text-xs text-red-800 bg-red-100" role="alert">
      <div className="flex items-center justify-center gap-x-2">
        <CircleAlert className="w-4 h-4" />
        <span>
          Before using this site you must complete your details, <Link href="/profile" className="font-bold underline underline-offset-2">here!</Link>
        </span>
      </div>
    </div>
  )
}

export default WarningCompletion;