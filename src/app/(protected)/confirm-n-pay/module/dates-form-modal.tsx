'use client';

import React from 'react';
import Modal from '@/components/ui/modal';
import Container from '@/components/ui/container';
import { Calendar } from '@/components/ui/calendar';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import CloseButton from '@/components/ui/button/close-button';
import { Button } from '@/components/ui/button/button';
import Heading from '@/components/ui/heading';
import { useUiLayoutStore } from '@/store/ui-layout';

function DatesFormModal() {
  const { showModal, closeModal } = useUiLayoutStore(state => state);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  console.log(date)

  return (
    <Modal
      open={showModal}
      onClose={() => closeModal()}
      variant='bottom'
    >
      <div className="w-full h-full pb-10">
        <Container className="relative flex flex-col justify-center w-full mx-auto mt-5">
          <div className="flex justify-end mt-4 mb-2">
            <CloseButton />
          </div>
          <Heading variant='lg' className="text-center text-foreground/75">Dates</Heading>
          <div className="mt-6 w-full">
            <h4 className="text-sm font-semibold truncate">
              Select Date
            </h4>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="mt-4 rounded-md border border-slate-200"
            />
          </div>
          <div className="mt-6 w-full">
            <h4 className="text-sm font-semibold truncate">
              Select Time
            </h4>
            <ToggleGroup
              type="single"
              variant="outline"
              className="flex-wrap justify-start mt-4 gap-2 text-xs text-foregorund/50 rounded-sm"
            >
              <ToggleGroupItem value="a">6:00AM</ToggleGroupItem>
              <ToggleGroupItem value="b">7:00AM</ToggleGroupItem>
              <ToggleGroupItem value="c">8:00Am</ToggleGroupItem>
              <ToggleGroupItem value="d">9:00AM</ToggleGroupItem>
              <ToggleGroupItem value="e">10:00AM</ToggleGroupItem>
              <ToggleGroupItem value="f">11:00AM</ToggleGroupItem>
              <ToggleGroupItem value="g">12:00AM</ToggleGroupItem>
              <ToggleGroupItem value="h">1:00PM</ToggleGroupItem>
              <ToggleGroupItem value="i">2:00PM</ToggleGroupItem>
              <ToggleGroupItem value="j">3:00PM</ToggleGroupItem>
              <ToggleGroupItem value="k">4:00PM</ToggleGroupItem>
              <ToggleGroupItem value="l">5:00PM</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex items-center justify-center mt-6 w-full">
            <Button
              className="bg-brand hover:bg-brand/90"
            >Save</Button>
          </div>
        </Container>
      </div>
    </Modal>
  )
}

export default DatesFormModal;