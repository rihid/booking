'use client'
import React from 'react'
import { Calendar } from '@/components/ui/calendar'
import Rating from '@/components/ui/rating';
import { useCounterStore } from '@/providers/store-providers/testing-provider';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Container from '@/components/ui/container';
import ModalDrawer from './drawer';
import { useUiLayoutStore } from '@/store/ui-layout';
import { Ratings } from '@/components/ui/ratings';

function Testing() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const { count, incrementCount, decrementCount } = useCounterStore(
    (state) => state,
  )

  const { openModal, setModalView, modalView } = useUiLayoutStore(state => state);
  const handleOpenModal = () => {
    setModalView('rc-drawer-view');
    openModal('rc-drawer-view');
  }
  return (
    <div>
      <Calendar
        mode="single"
        // captionLayout='dropdown-years'
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow"
      />
      <div>
        <Rating />
        <Ratings rating={0} variant='yellow' />
      </div>
      <div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open</Button>
          </SheetTrigger>
          <button type='button' className="wrapper fixed bg-black/25 cursor-default"></button>
          <SheetContent side='bottom' className='wrapper'>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you're done.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                {/* <Input id="name" value="Pedro Duarte" className="col-span-3" /> */}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                {/* <Input id="username" value="@peduarte" className="col-span-3" /> */}
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <div>
        <Button onClick={handleOpenModal}>Open</Button>
      </div>
      <div className="h-[600px] bg-blue-200">test</div>
      {modalView === 'rc-drawer-view' && <ModalDrawer />}
    </div>
  )
}

export default Testing