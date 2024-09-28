'use client';

import React from 'react';
import Modal from '@/components/ui/modal';
import Container from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import CounterButton from '@/components/ui/button/counter-button';
import CloseButton from '@/components/ui/button/close-button';
import Heading from '@/components/ui/heading';
import { useUiLayoutStore } from '@/store/ui-layout';

function RiderFormModal() {
  const { showModal, closeModal } = useUiLayoutStore(state => state);
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
          <Heading variant='lg' className="text-center text-foreground/75">Riders</Heading>
          <div className="mt-6 w-full space-y-6">
            <Card className='flex items-center justify-between py-3 px-8'>
              <div>
                <Heading variant='sm' className="text-muted-foreground">Single Riders</Heading>
                <div className="font-normal text-xs text-foreground/50">
                  <span>Aged 13+</span>
                </div>
              </div>
              <CounterButton qty={1} />
            </Card>
            <Card className='flex items-center justify-between py-3 px-8'>
              <div>
                <Heading variant='sm' className="text-muted-foreground">Couple Riders</Heading>
                <div className="font-normal text-xs text-foreground/50">
                  <span>Aged 13+</span>
                </div>
              </div>
              <CounterButton qty={0} />
            </Card>
          </div>
        </Container>
      </div>
    </Modal>
  )
}

export default RiderFormModal;
