'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';
import { useUiLayoutStore } from '@/store/ui-layout';
import { useTripStore } from '@/providers/store-providers/trip-provider';
import Heading from '@/components/ui/heading';
import { currency } from '@/lib/helper';

function BookingDetailModal() {
  const { showModal, closeModal, modalView } = useUiLayoutStore(state => state);
  const { tripBook } = useTripStore(state => state);
  const [type, setType] = React.useState('')
  let typeTest
  if(tripBook) {
    const typeVal = tripBook.type_id 
  }

  return (
    <div>
      {modalView === 'trip-booking-view' &&
        <Dialog
          open={showModal}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              closeModal();
            }
          }}
        >
          <DialogContent className="max-w-sm">
            <DialogHeader className="border-b -mx-6">
              <DialogTitle className="text-base pb-4 px-6">Info</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 items-center justify-center">
              <div className="w-full py-3 space-y-2">
                <div className="w-full flex items-start justify-between">
                  <div>
                    <Heading variant='xs' className="text-muted-foreground">Customer</Heading>
                    <div className="font-bold text-sm capitalize text-foreground/50">
                      <span>{tripBook.customer.name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Heading variant='xs' className="text-muted-foreground">Customer No</Heading>
                    <div className="font-bold text-sm text-foreground/50">
                      <span>{tripBook.customer_no}</span>
                    </div>
                  </div>
                </div>
                <div className="w-full flex items-start justify-between">
                  <div>
                    <Heading variant='xs' className="text-muted-foreground">Booking Type</Heading>
                    <div className="font-bold text-sm text-foreground/50">
                      <span>{}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Heading variant='xs' className="text-muted-foreground">Amout</Heading>
                    <div className="font-bold text-sm text-foreground/50">
                      <span>{currency(parseFloat(tripBook.total))}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <QRCodeSVG
                  value={tripBook.book_no}
                  size={240}
                />
              </div>
            </div>
            {/* <pre>{JSON.stringify(tripBook.book_no, null, 2)}</pre> */}
          </DialogContent>
        </Dialog>
      }
    </div>
  )
}

export default BookingDetailModal