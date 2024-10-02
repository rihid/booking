'use client'

import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { useBookStore } from '@/providers/store-providers/book-provider';


export default function CounterButton({
  counter,
  defaultValue = 1,
}: {
  counter: number;
  defaultValue?: number
}) {
  const { updateBookingField } = useBookStore(state => state)
  const [count, setCount] = React.useState(defaultValue);

  const handlePlus = () => {
    if (count < 10) {
      setCount(prev => prev + counter)
    }
  }
  const handleMinus = () => {
    if (count >= 1) {
      setCount(prev => prev - counter)
    }
  }
  return (
    <div className="flex space-x-2 items-center">
      <div className="h-6 flex border border-slate-200 delay-150 ease-in-out divide-x-[1px] text-sm font-normal divide-slate-200 rounded-sm">
        <button
          type="button"
          onClick={handleMinus}
          disabled={count === 0}
          className="flex-none px-1 text-muted-foreground hover:bg-brand/30 hover:text-brand hover:rounded-l-sm disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-muted-foreground disabled:opacity-50"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="flex-1 w-8 text-xs text-center text-muted-foreground flex items-center justify-center">
          {count}
        </div>
        <button
          type="button"
          onClick={handlePlus}
          disabled={count === 10}
          className="flex-none px-1 text-muted-foreground hover:bg-brand/30 hover:text-brand hover:rounded-l-sm disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-muted-foreground disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div >
  )
}
