'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { useUiLayoutStore } from '@/store/ui-layout';
import { CustomerType } from './customer-list-client';
import { DialogTitle } from '@radix-ui/react-dialog';

function CustomerDetailModal({
  customerData,
}: {
  customerData: CustomerType | null;
}) {
  const { showModal, closeModal } = useUiLayoutStore(state => state);
  return (
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
        <ul className="flex flex-col gap-4">
          <li className="flex space-x-3">
            {/* <div className="flex-none text-sm text-muted-foreground">
              <Mail />
            </div> */}
            <div className="flex-1">
              <div className="uppercase text-xs font-semibold">
                name
              </div>
              <p
                className="text-base capitalize"
              >
                {customerData?.name}
              </p>
            </div>
          </li>
          <li className="flex space-x-3">
            {/* <div className="flex-none text-sm text-muted-foreground">
              <Mail />
            </div> */}
            <div className="flex-1">
              <div className="uppercase text-xs font-semibold">
                customer no
              </div>
              <p
                className="text-base capitalize"
              >
                {customerData?.customer_no}
              </p>
            </div>
          </li>
          <li className="flex space-x-3">
            {/* <div className="flex-none text-sm text-muted-foreground">
              <Mail />
            </div> */}
            <div className="flex-1">
              <div className="uppercase text-xs font-semibold">
                indentity number
              </div>
              <p
                className="text-base capitalize"
              >
                {customerData?.identity_number}
              </p>
            </div>
          </li>
          <li className="flex space-x-3">
            {/* <div className="flex-none text-sm text-muted-foreground">
              <Mail />
            </div> */}
            <div className="flex-1">
              <div className="uppercase text-xs font-semibold">
                email
              </div>
              <Link
                href={`maito:${customerData?.email}`}
                className="text-base"
              >
                {customerData?.email}
              </Link>
            </div>
          </li>
          <li className="flex space-x-3">
            {/* <div className="flex-none text-sm text-muted-foreground">
              <Mail />
            </div> */}
            <div className="flex-1">
              <div className="uppercase text-xs font-semibold">
                phone
              </div>
              <Link
                href={`tel:${customerData?.phone}`}
                className="text-base"
              >
                {customerData?.phone}
              </Link>
            </div>
          </li>
          <li className="flex space-x-3">
            {/* <div className="flex-none text-sm text-muted-foreground">
              <Mail />
            </div> */}
            <div className="flex-1">
              <div className="uppercase text-xs font-semibold">
                address
              </div>
              <p
                className="text-base capitalize"
              >
                {customerData?.address}
              </p>
            </div>
          </li>
        </ul>
      </DialogContent>
    </Dialog>
  )
}

export default CustomerDetailModal