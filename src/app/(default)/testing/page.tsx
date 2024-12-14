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
import { useUiLayoutStore } from '@/store/ui-layout';
import { Ratings } from '@/components/ui/ratings';
import { BookingCardLoader, BookingListLoader } from '@/components/partial/loader';
import { toast } from "sonner"

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
  const handleClick = () => {
    toast.success("Event has been created")
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
        <Button onClick={handleOpenModal}>Open</Button>
      </div>
      <div>
        <Button
          variant="outline"
          onClick={handleClick}
        >
          Show Toast
        </Button>
      </div>
    </div>
  )
}

export default Testing