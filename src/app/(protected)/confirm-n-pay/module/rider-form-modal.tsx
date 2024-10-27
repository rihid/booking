'use client';

import React from 'react';
import Modal from '@/components/ui/modal';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import Container from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Plus, Minus } from 'lucide-react';
import CloseButton from '@/components/ui/button/close-button';
import Heading from '@/components/ui/heading';
import { useUiLayoutStore } from '@/store/ui-layout';
import { useBookStore } from '@/providers/store-providers/book-provider';
import { ScrollArea } from '@/components/ui/scroll-area';

type Props = {
  numbers: any;
}

function CounterButton({
  counter,
  defaultValue = 1,
  onCountChange,
}: {
  counter: number;
  defaultValue?: number;
  onCountChange: (newCount: number) => void;
}) {
  const [count, setCount] = React.useState(defaultValue);

  const handlePlus = () => {
    if (count < 10) {
      const newCount = count + counter;
      setCount(newCount);
      onCountChange(newCount);
    }
  }
  const handleMinus = () => {
    if (count >= 1) {
      const newCount = count - counter;
      setCount(newCount);
      onCountChange(newCount);
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

function RiderFormModal({
  numbers,
}: Props) {
  const { showModal, closeModal } = useUiLayoutStore(state => state);
  return (
    <Sheet
      open={showModal}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          closeModal();
        }
      }}
    >
      <SheetContent side="bottom" className="wrapper flex flex-col justify-between w-full h-3/4 rounded-t-2xl">
        <SheetHeader>
          <SheetTitle className="text-center text-foreground/75">Riders</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-grow w-full">
          <div className="mt-6 w-full space-y-6">
            {numbers.map((number: any, idx: number) => {
              const { bookingField, updateBookingField } = useBookStore(state => state);

              const handleCountChange = (countVal: number) => {
                console.log(countVal)
                const numberArr = [...bookingField.numbers];
                numberArr[idx] = {
                  ...numberArr[idx],
                  qty: countVal.toString(),
                };
                updateBookingField({ numbers: numberArr });
                console.log(bookingField)
              };
              return (
                <Card key={idx} className='flex items-center justify-between py-3 px-8'>
                  <div>
                    <Heading variant='sm' className="text-muted-foreground">{number.variant} Riders ({number.total_rider})</Heading>
                    <div className="font-normal text-xs text-foreground/50">
                      <span>Aged 13+</span>
                    </div>
                  </div>
                  <CounterButton defaultValue={parseInt(number.qty)} counter={1} onCountChange={handleCountChange} />
                </Card>
              )
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default RiderFormModal;
